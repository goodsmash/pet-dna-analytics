// Pet Photo Analysis API Route
// Visual trait detection with genetic correlation

import { analyzePetPhoto } from '../utils/pet-visual-trait-analyzer.js';

export async function POST({ request }) {
  try {
    // Handle multipart form data for image upload
    const formData = await request.formData();
    const image = formData.get('image');
    const species = formData.get('species') || 'cat';
    const petName = formData.get('pet_name') || 'Your Pet';
    
    if (!image) {
      return new Response(JSON.stringify({
        error: 'No image provided'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Validate image
    if (!image.type.startsWith('image/')) {
      return new Response(JSON.stringify({
        error: 'Invalid file type. Please upload an image.'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Convert image to buffer for analysis
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    
    // Analyze photo
    const analysis = await analyzePetPhoto(imageBuffer, species);
    
    return new Response(JSON.stringify({
      success: true,
      pet_name: petName,
      species: species,
      analysis: analysis,
      next_steps: {
        recommended_genetic_tests: analysis.genetic_correlation.map(c => ({
          trait: c.trait,
          gene: c.gene,
          priority: c.action ? 'high' : 'moderate'
        })),
        upload_genetic_data: '/api/analyze-family-dna'
      },
      timestamp: new Date().toISOString()
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error('Photo analysis error:', error);
    return new Response(JSON.stringify({
      error: 'Photo analysis failed',
      message: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Get example traits that can be detected
export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    detectable_traits: {
      coat: ['color', 'length', 'texture', 'pattern', 'white_spotting'],
      facial: ['ear_shape', 'ear_size', 'face_shape', 'eye_color'],
      body: ['tail_length', 'tail_shape', 'polydactyly', 'body_type'],
      genetic_correlations: [
        { trait: 'Colorpoint coat', gene: 'TYR', testable: true },
        { trait: 'Long hair', gene: 'FGF5', testable: true },
        { trait: 'Folded ears', gene: 'TRPV4', testable: true, health_note: 'Homozygotes at risk' },
        { trait: 'Short tail', gene: 'T-box', testable: true },
        { trait: 'Extra toes', gene: 'LMBR1', testable: true },
        { trait: 'Curly coat', gene: 'KRT71/LPAR6', testable: true },
        { trait: 'Hairless', gene: 'KRT71', testable: true }
      ]
    },
    disclaimer: 'Photo analysis provides visual insights. Genetic testing confirms heritable traits. Veterinary examination verifies health status.'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
