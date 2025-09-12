/// <reference types="@testing-library/jest-dom" />

import { render } from "@testing-library/react";
import CVSection from "../components/CVSection";
import en from "../data/cv.en.json";

// Define the type for the CV data based on the structure in cv.en.json
type CVData = typeof en;

describe("CVSection", () => {
  it("renders without crashing", () => {
    const { getByText } = render(<CVSection data={en as CVData} />);
    expect(getByText(/Cintya Huaire/)).toBeInTheDocument();
    // The following line checks for any of the three language titles
    expect(
      getByText(
        /Policy Specialist|Especialista en Políticas|Spécialiste des politiques/
      )
    ).toBeTruthy();
  });
});
