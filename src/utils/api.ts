export async function replaceAudioFile(trackId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch(`/api/tracks/${trackId}/upload`, {
      method: "PUT",
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to replace audio file");
    }
  
    return response.json();
  }
  