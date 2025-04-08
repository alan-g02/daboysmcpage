// Configuration - Update these values for your repository
const GITHUB_USER = "alan-g02";
const GITHUB_REPO = "daboysmcpage";
const RESOURCE_FOLDER = "resource_packs"; // Folder within your repo where resource packs are stored
const FALLBACK_PAGE = "resource-fallback.html";

// DOM Elements
const resourcesContainer = document.getElementById("resources-list");
const errorElement = document.getElementById("error-message");

// Main function to load and display resources
async function loadResources() {
  try {
    // Fetch resource pack list from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${RESOURCE_FOLDER}`
    );

    // Handle API errors
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    displayResources(files);
  } catch (error) {
    handleError(error);
  }
}

// Display resources in a table
function displayResources(files) {
  // Filter for .jar files and sort alphabetically
  const jarFiles = files
    .filter((file) => file.name.endsWith(".jar"))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (jarFiles.length === 0) {
    resourcesContainer.innerHTML =
      "<p>No resource packs found in the repository.</p>";
    return;
  }

  // Create table HTML
  let html = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
            <tr style="background: #e0e0e0;">
                <th style="padding: 10px; text-align: left;">Resource File</th>
                <th style="padding: 10px; text-align: left;">Size</th>
                <th style="padding: 10px; text-align: left;">Download</th>
            </tr>
        </thead>
        <tbody>
    `;

  // Add each resource as a table row
  jarFiles.forEach((file) => {
    const sizeInKB = (file.size / 1024).toFixed(1);
    html += `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${file.name}</td>
            <td style="padding: 10px;">${sizeInKB} KB</td>
            <td style="padding: 10px;">
                <a href="${file.download_url}" 
                   style="display: inline-block; 
                          background: #2c3e50; 
                          color: white; 
                          padding: 5px 10px; 
                          text-decoration: none; 
                          border-radius: 4px;">
                   Download
                </a>
            </td>
        </tr>
        `;
  });

  html += `</tbody></table>`;
  resourcesContainer.innerHTML = html;
}

// Handle errors
function handleError(error) {
  console.error("Error loading resources:", error);
  errorElement.style.display = "block";
  resourcesContainer.innerHTML = `
    <p>Could not load resources automatically. Please visit our 
    <a href="${FALLBACK_PAGE}">fallback resources list</a>.</p>
    `;
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", loadResources);
