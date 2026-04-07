# Pet DNA Analytics Platform

A comprehensive genetic analysis platform for pets (feline focus), integrating research-grade epidemiological data with stunning Three.js visualizations.

## Features

- **Research Foundation**: Built on PLoS Genetics study of 11,036 domestic cats (Anderson et al., 2022)
- **90+ Breeds Supported**: Complete breed database with population statistics
- **87 Genetic Variants**: Disease, blood type, and trait variant analysis
- **3D Genome Visualization**: Interactive Three.js genome orb with risk-coded nodes
- **Hierarchical Ensemble Analysis**: Multi-layer genetic inference engine
- **7,815 SNP Markers**: Genome-wide diversity scoring

## Tech Stack

- React Router v7
- React Three Fiber (Three.js)
- Hono (API framework)
- TypeScript
- Tailwind CSS

## Key Components

### Backend Analysis Engine
- `unified-research-hub.js` — Main research processing pipeline
- `ensemble-engine.js` — Hierarchical variant detection
- `feline-epidemiology.js` — Research-grade epidemiological data
- `feline-genetic-markers.js` — 87 variant marker database
- `breed-database.js` — 90 breed population database

### Frontend Visualization
- `GeneticVisualization.jsx` — Three.js genome orb component
- Risk-coded nodes (Red=high risk, Amber=carrier, Blue=protective, Green=low risk)
- Interactive orbital controls
- Real-time health summary dashboard

## Data Sources

- **Primary Study**: "Genetic epidemiology of blood type, disease and trait variants, and genome-wide genetic diversity in over 11,000 domestic cats" (PLoS Genetics, 2022)
- **DOI**: 10.1371/journal.pgen.1009804
- **Dryad Dataset**: 10.5061/dryad.gb5mkkwrg (7,815 SNP genotypes)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
cd apps/web
pnpm run dev

# Server runs on http://localhost:4000
```

## Research Capabilities

### Health Analysis
- Blood type prediction (A/B/AB) via CMAH markers
- Disease variant detection (HCM, PKD, PRA, PK-Def, etc.)
- Medication sensitivity (MDR1/ABCB1)
- Carrier status identification

### Breed Insights
- Population statistics for 90 breeds
- Geographic distribution analysis
- Genetic diversity scoring
- Inbreeding risk assessment

### Clinical Recommendations
- Veterinary consultation triggers
- Monitoring schedules
- Breeding guidance
- Medication warnings

## License

MIT License - Research data used under CC-BY 4.0
