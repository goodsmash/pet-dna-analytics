// Downloadable sample DNA files for testing
// These are mock representations of real VCF/CSV format genetic data

const SAMPLE_CAT_VCF = `##fileformat=VCFv4.2
##reference=GCF_018350175.1_F.catus_Fca126_mat1.0
##source=MockCatDNAGenerator
##INFO=<ID=MARKER,Number=1,Type=String,Description="Genetic Marker Name">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
A1	12345678	MC1R	C	T	99	PASS	MARKER=MC1R_coat_color
A1	23456789	ASIP	G	A	99	PASS	MARKER=ASIP_tabby_pattern
B1	34567890	TYR	A	G	95	PASS	MARKER=TYR_colorpoint
A2	45678901	MYBPC3	G	C	89	PASS	MARKER=MYBPC3_A31P_HCM_risk
D2	56789012	PKD1	T	C	92	PASS	MARKER=PKD1_kidney_disease
B3	67890123	FGF5	G	A	98	PASS	MARKER=FGF5_longhair
C1	78901234	KIT	C	T	96	PASS	MARKER=KIT_white_spotting
D1	89012345	OCA2	A	G	94	PASS	MARKER=OCA2_blue_eyes
E1	90123456	TYRP1	G	T	97	PASS	MARKER=TYRP1_color_dilution
F1	12309876	MLPH	C	T	93	PASS	MARKER=MLPH_blue_grey_dilute
`;

const SAMPLE_DOG_VCF = `##fileformat=VCFv4.2
##reference=UU_Cfam_GSD_1.0_dog_genome
##source=Dog10K_Project_MockData
##INFO=<ID=MARKER,Number=1,Type=String,Description="Genetic Marker Name">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO
chr5	12345678	MC1R_E	C	T	99	PASS	MARKER=MC1R_E_locus_yellow_red
chr32	23456789	FGF5	G	A	99	PASS	MARKER=FGF5_longhair
chr14	34567890	ABCB1	C	T	98	PASS	MARKER=ABCB1_MDR1_drug_sensitivity
chr11	45678901	FBN2	A	G	96	PASS	MARKER=FBN2_hip_dysplasia_risk
chr31	56789012	SOD1	G	A	95	PASS	MARKER=SOD1_degenerative_myelopathy
chr18	67890123	FGF4	C	T	97	PASS	MARKER=FGF4_chondrodysplasia_short_legs
chr25	78901234	CBD103	G	A	99	PASS	MARKER=CBD103_tan_points
chr10	89012345	PSMB7	A	C	94	PASS	MARKER=PSMB7_merle_pattern
chr27	90123456	MITF	C	G	96	PASS	MARKER=MITF_white_flash_piebald
chr13	12309876	LCORL	A	T	98	PASS	MARKER=LCORL_height_variation
`;

const SAMPLE_CAT_CSV = `marker,genotype,chromosome,position,annotation
MC1R,C/T,A1,12345678,Coat color - red/black determination
ASIP,G/A,B1,23456789,Tabby pattern agouti locus
TYR,A/G,C1,34567890,Colorpoint Siamese pattern
MYBPC3_A31P,G/C,A2,45678901,HCM risk carrier - Hypertrophic Cardiomyopathy
PKD1,T/C,D2,56789012,PKD carrier - Polycystic Kidney Disease
FGF5,G/A,B3,67890123,Longhair trait
KIT,C/T,C1,78901234,White spotting pattern
OCA2,A/G,D1,89012345,Eye color - blue eyes
TYRP1,G/T,E1,90123456,Coat color dilution
MLPH,C/T,F1,12309876,Blue/grey coat dilution
`;

const SAMPLE_DOG_CSV = `marker,genotype,chromosome,position,annotation
MC1R_E,C/T,chr5,12345678,Yellow/red coat color E locus
FGF5,G/A,chr32,23456789,Long hair trait
ABCB1,C/T,chr14,34567890,MDR1 drug sensitivity mutation
FBN2,A/G,chr11,45678901,Hip dysplasia genetic risk factor
SOD1,G/A,chr31,56789012,Degenerative Myelopathy carrier
FGF4,C/T,chr18,67890123,Short legs chondrodysplasia
CBD103,G/A,chr25,78901234,Tan points coat pattern
PSMB7,A/C,chr10,89012345,Merle coat pattern
MITF,C/G,chr27,90123456,White flash/piebald pattern
LCORL,A/T,chr13,12309876,Height variation locus
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species") || "cat";
  const format = searchParams.get("format") || "vcf";

  let content;
  let contentType;
  let filename;

  if (species === "cat") {
    if (format === "vcf") {
      content = SAMPLE_CAT_VCF;
      contentType = "text/plain";
      filename = "sample_cat_dna.vcf";
    } else {
      content = SAMPLE_CAT_CSV;
      contentType = "text/csv";
      filename = "sample_cat_dna.csv";
    }
  } else {
    if (format === "vcf") {
      content = SAMPLE_DOG_VCF;
      contentType = "text/plain";
      filename = "sample_dog_dna.vcf";
    } else {
      content = SAMPLE_DOG_CSV;
      contentType = "text/csv";
      filename = "sample_dog_dna.csv";
    }
  }

  return new Response(content, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
