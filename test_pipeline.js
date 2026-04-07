    // Using native fetch which is available in newer node versions
async function testPipeline() {
  const payload = {
    petId: "sample_pet_001",
    fileUrl: "https://raw.githubusercontent.com/DarwinsArk/DD_Breed-Reference-Panel_V.1/master/REF/labrador_retriever.tped",
    tier: "ULTRA",
    enableValidation: true
  };
  
  try {
    const response = await fetch("http://localhost:4000/api/analyze-dna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log("Analysis Result Sample:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Test failed: Ensure your backend server is running on port 4000.", err);
  }
}

testPipeline();
