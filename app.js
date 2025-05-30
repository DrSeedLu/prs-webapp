
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("titleInput");
  const traitRadios = document.querySelectorAll("input[name='trait']");
  const populationSelect = document.getElementById("populationSelect");
  const toolSelect = document.getElementById("toolSelect");
  const datasetInput = document.getElementById("datasetInput");
  const processBtn = document.getElementById("processBtn");
  const progressBar = document.getElementById("progressBar");
  const progressContainer = document.getElementById("progressContainer");
  const resultsSection = document.getElementById("resultsSection");
  const resultsImage = document.getElementById("resultsImage");
  const downloadLinks = document.getElementById("downloadLinks");

  let isProcessing = false;

  processBtn.addEventListener("click", async () => {
    if (isProcessing) {
      // Clear form and reset
      titleInput.value = "";
      titleInput.disabled = false;
      datasetInput.value = "";
      resultsSection.classList.add("hidden");
      processBtn.textContent = "Run Pipeline";
      isProcessing = false;

      await fetch("https://prs-backend-avi2.onrender.com/clear", { method: "POST" });
      return;
    }

    const selectedTrait = [...traitRadios].find(r => r.checked)?.value;
    const selectedTools = [...toolSelect.selectedOptions].map(opt => opt.value);
    const selectedPopulation = populationSelect.value;
    const datasetFile = datasetInput.files[0];

    if (!selectedTrait || selectedTools.length < 2 || !datasetFile) {
      alert("Please select trait, at least 2 tools, and upload a dataset.");
      return;
    }

    // Disable title field during processing
    titleInput.disabled = true;
    isProcessing = true;
    processBtn.textContent = "Clear";

    // Show progress bar
    progressContainer.classList.remove("hidden");
    progressBar.style.width = "0%";

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("trait", selectedTrait);
    formData.append("population", selectedPopulation);
    selectedTools.forEach(tool => formData.append("tools[]", tool));
    formData.append("dataset", datasetFile);

    try {
      const uploadRes = await fetch("https://prs-backend-avi2.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      let progress = 0;
      const interval = setInterval(() => {
        if (progress < 90) {
          progress += 10;
          progressBar.style.width = progress + "%";
        }
      }, 500);

      const uploadJson = await uploadRes.json();
      clearInterval(interval);
      progressBar.style.width = "100%";

      // Show result image
      resultsImage.src = "https://prs-backend-avi2.onrender.com/results/prs_visualisation_results/results.png";

      // Create download links
      downloadLinks.innerHTML = "";
      uploadJson.results.forEach(path => {
        const name = path.split("/").pop();
        const link = document.createElement("a");
        link.href = `https://prs-backend-avi2.onrender.com/download/${name}`;
        link.className = "text-blue-600 underline";
        link.textContent = name;
        const li = document.createElement("li");
        li.appendChild(link);
        downloadLinks.appendChild(li);
      });

      resultsSection.classList.remove("hidden");

    } catch (err) {
      alert("An error occurred: " + err.message);
      processBtn.textContent = "Run Pipeline";
      isProcessing = false;
      titleInput.disabled = false;
    }
  });
});
