
/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render } from "@testing-library/react";
import CVSection from "../components/CVSection";
import en from "../data/cv.en.json";
import es from "../data/cv.es.json";
import fr from "../data/cv.fr.json";

// Define the type for the CV data based on the structure in cv.en.json
type CVData = typeof en;

describe("CVSection", () => {
  it("renders English CV and section titles", () => {
    const { getByText } = render(<CVSection data={en as CVData} />);
    expect(getByText(/Cintya Huaire/)).toBeInTheDocument();
    expect(getByText(/Data & Policy Analyst | Digital Innovation for Migration & Social Protection/)).toBeInTheDocument();
    expect(getByText("Summary")).toBeInTheDocument();
    expect(getByText("Professional Experience")).toBeInTheDocument();
    expect(getByText("Education")).toBeInTheDocument();
    expect(getByText("Languages")).toBeInTheDocument();
    expect(getByText("Download PDF")).toBeInTheDocument();
  });

  it("renders Spanish CV and section titles", () => {
    const { getByText } = render(<CVSection data={es as CVData} />);
    expect(getByText(/Cintya Huaire/)).toBeInTheDocument();
    expect(getByText(/Analista de Datos y Políticas/)).toBeInTheDocument();
    expect(getByText("Resumen")).toBeInTheDocument();
    expect(getByText("Experiencia Profesional")).toBeInTheDocument();
    expect(getByText("Educación")).toBeInTheDocument();
    expect(getByText("Idiomas")).toBeInTheDocument();
    expect(getByText("Descargar PDF")).toBeInTheDocument();
  });

  it("renders French CV and section titles", () => {
    const { getByText } = render(<CVSection data={fr as CVData} />);
    expect(getByText(/Cintya Huaire/)).toBeInTheDocument();
    expect(getByText(/Analyste en Données et Politiques/)).toBeInTheDocument();
    expect(getByText("Résumé")).toBeInTheDocument();
    expect(getByText("Expérience Professionnelle")).toBeInTheDocument();
    expect(getByText("Éducation")).toBeInTheDocument();
    expect(getByText("Langues")).toBeInTheDocument();
    expect(getByText("Télécharger le PDF")).toBeInTheDocument();
  });
});
