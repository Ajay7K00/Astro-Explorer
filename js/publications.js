document.addEventListener("DOMContentLoaded", function () {
    const authorId = "103320645"; // Dr. Anil N. Raghav's Semantic Scholar ID
    const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,year,authors,externalIds,venue,publicationDate,isOpenAccess`;

    async function fetchPublisher(doi) {
        if (!doi) return "";
        try {
            const response = await fetch(`https://api.crossref.org/works/${doi}`);
            if (!response.ok) return "";
            const data = await response.json();
            return data.message["container-title"] ? data.message["container-title"][0] : "";
        } catch (error) {
            console.error("Error fetching publisher:", error);
            return "";
        }
    }

    async function fetchPublications() {
        const publicationsContainer = document.querySelector(".publications-container");
        publicationsContainer.innerHTML = `<p class="loading">Loading publications...</p>`; // Show loading text

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch publications");
            const data = await response.json();
            let publicationsByYear = {};

            // Prepare all publisher fetch requests at once
            let publisherPromises = data.data.map(async (paper) => {
                if (!paper.venue && paper.externalIds.DOI) {
                    return fetchPublisher(paper.externalIds.DOI);
                }
                return paper.venue || "";
            });

            let resolvedPublishers = await Promise.all(publisherPromises);

            data.data.forEach((paper, index) => {
                let year = paper.year || "Unknown";
                if (!publicationsByYear[year]) publicationsByYear[year] = [];

                let authorsList = paper.authors.map(a => 
                    `<span class="author-tag">
                        <a href="https://www.semanticscholar.org/author/${a.authorId}" target="_blank">${a.name}</a>
                    </span>`
                ).join(" ");

                let bibtexAuthors = paper.authors.map(a => a.name).join(" and ");

                let paperLink = paper.externalIds.DOI ? `https://doi.org/${paper.externalIds.DOI}` : "#";

                let publicationDate = paper.publicationDate
                    ? new Date(paper.publicationDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                      })
                    : "Unknown Date";

                let publisher = resolvedPublishers[index];
                let venueHTML = publisher ? `<a href="${paperLink}" target="_blank">${publisher}</a>` : "";

                let isOpenAccess = paper.isOpenAccess 
                    ? `<span class="open-access-tag">📄 Open Access</span>` 
                    : "";

                // Generate BibTeX citation
                let bibtexKey = (paper.authors.length > 0 
                    ? paper.authors[0].name.split(" ").slice(-1)[0] 
                    : "Unknown") + year;

                let bibtexCitation = `
@article{${bibtexKey},
  author = {${bibtexAuthors}},
  title = {${paper.title}},
  journal = {${publisher || "Unknown"}},
  year = {${year}},
  doi = {${paper.externalIds.DOI || "N/A"}},
  url = {${paperLink}},
  note = {Accessed: ${new Date().toISOString().split("T")[0]}}
}`.trim();

                publicationsByYear[year].push(`
                    <li class="publication-item">
                        <div class="publication-content">
                            <a href="${paperLink}" target="_blank" class="publication-title">${paper.title}</a>
                            <div class="publication-meta">
                                ${authorsList} · ${venueHTML} · ${publicationDate}
                            </div>
                            <div class="publication-actions">
                                ${isOpenAccess}
                                <button class="cite-button">📄 Cite</button>
                                <pre class="citation-text hidden">${bibtexCitation}</pre>
                            </div>
                        </div>
                    </li>
                `);
            });

            // Sort by year (descending)
            let sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);
            publicationsContainer.innerHTML = "";

            sortedYears.forEach(year => {
                let yearSection = document.createElement("div");
                yearSection.classList.add("year-section");
                yearSection.innerHTML = `
                    <h2>${year}</h2>
                    <ul class="publication-list">${publicationsByYear[year].join("")}</ul>
                `;
                publicationsContainer.appendChild(yearSection);
            });

        } catch (error) {
            console.error("Error fetching publications:", error);
            publicationsContainer.innerHTML = `<p class="error">Failed to load publications.</p>`;
        }
    }

    // Fetch publications on page load
    fetchPublications();

    // Refresh publications every 5 minutes
    setInterval(fetchPublications, 300000);

    // Toggle visibility of the BibTeX citation (event delegation)
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("cite-button")) {
            let citationText = event.target.nextElementSibling;
            citationText.classList.toggle("hidden");
        }
    });
});
