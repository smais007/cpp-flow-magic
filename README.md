# C++ Flowchart Generator

This project is a Next.js application that generates a flowchart from a given C++ code snippet. The flowchart is generated using OpenAI's GPT-4 model and PlantUML.

## Features

- Generate a flowchart from a C++ code snippet
- Supports C++11 and later standards
- Option to save the generated flowchart as an SVG or PNG image

## How to use

1. Clone the repository
2. Install the dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Enter a C++ code snippet in the text area and click the "Generate" button
6. The flowchart will be displayed below the text area

## Configuration

- The OpenAI API key is stored in the `.env` file as `OPENAI_API_KEY`
- The PlantUML server URL is stored in the `.env` file as `PLANTUML_SERVER_URL`
- The PlantUML skin parameter is stored in the `.env` file as `PLANTUML_SKIN`

## Screenshots

![Screenshot of the application](https://github.com/shadcn/cpp-flowchart-generator/raw/main/screenshots/screenshot.png)

## Contributing

Contributions are welcome! Please open an issue or create a pull request if you have any suggestions or bug fixes.
