// Allow only one trait checkbox
function toggleTrait(checkbox) {
  document.querySelectorAll('input[name="trait"]').forEach(cb => {
    if (cb !== checkbox) cb.checked = false;
  });
}

// Populate dropdowns with dummy tool names
const tools = ['PRSice', 'LDpred2', 'SBayesR', 'PLINK', 'lassosum', 'SNPTEST'];
document.querySelectorAll('.tool-dropdown').forEach(select => {
  tools.forEach(tool => {
    const option = document.createElement('option');
    option.value = tool;
    option.text = tool;
    select.appendChild(option);
  });
});

// Start process placeholder
function startProcess() {
  const title = document.getElementById('titleInput').value;
  const trait = document.querySelector('input[name="trait"]:checked')?.value;
  const selectedTools = Array.from(document.querySelectorAll('.tool-dropdown')).map(select => select.value);

  alert(\`Process: \${title}\nTrait: \${trait}\nTools: \${selectedTools.join(', ')}\`);

  // TODO: Connect to backend later
}
