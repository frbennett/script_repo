async function handleGitHubAction(owner, repo, path, action) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const githubUrl = `https://github.com/${owner}/${repo}/tree/main/${path}`;

  if (action === 'open') {
    window.open(githubUrl, '_blank');
    return;
  }

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (Array.isArray(data)) {
    // Directory download
    const zip = new JSZip();
    for (const file of data) {
      if (file.type === "file") {
        const fileRes = await fetch(file.download_url);
        const content = await fileRes.text();
        zip.file(file.name, content);
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${path.split('/').pop()}.zip`;
    link.click();
  } else if (data.type === "file") {
    // Single file download
    const decoded = atob(data.content.replace(/\n/g, ''));
    const blob = new Blob([decoded], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.name;
    link.click();
  } else {
    alert("Unsupported content type or path not found.");
  }
}