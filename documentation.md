# PatchWise Documentation

This document provides comprehensive information about the PatchWise platform, including its features, installation, configuration, and usage.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Installation](#installation)
    *   [Prerequisites](#prerequisites)
    *   [Setup](#setup)
    *   [API Key Configuration](#api-key-configuration)
4.  [Usage](#usage)
    *   [Running Locally](#running-locally)
    *   [Key Modules](#key-modules)
5.  [Limitations](#limitations)
6.  [Contributing](#contributing)
7.  [License](#license)

## 1. Introduction

PatchWise is an AI-powered vulnerability management platform designed to assist security teams in efficiently identifying, analyzing, prioritizing, and remediating security vulnerabilities. By leveraging generative AI, PatchWise streamlines various stages of the vulnerability management lifecycle, enabling a proactive and risk-based approach to cybersecurity.

## 2. Features

PatchWise offers a range of features to enhance vulnerability management:

*   **Vulnerability Data Ingestion and Normalization:** Ingests vulnerability data from various sources and uses AI to normalize and standardize the data.
*   **Vulnerability Asset Mapping:** Maps identified vulnerabilities to organizational assets using AI correlation.
*   **AI-Driven Patch Advisor:** Provides AI-powered patch recommendations based on vulnerability analysis, asset criticality, and potential impact.
*   **Vulnerability Overview Dashboard:** Displays key vulnerability metrics and patch status.
*   **Interactive Vulnerability Chat:** A chat interface for natural language queries about vulnerabilities and patches.
*   **Customizable Security Reports:** Generates reports on vulnerability status, patch compliance, and security posture.
*   **Nmap Service Scan Parsing:** Parses Nmap Service Scan XML output using AI.
*   **Intelligent Patch Prioritization:** Prioritizes patches based on scan data and outdated service versions using AI.
*   **Actionable Documentation:** Produces clear documentation for stakeholders.

## 3. Installation

### Prerequisites

Before installing PatchWise, ensure you have the following installed:

*   Node.js (and npm or yarn)
*   Git

### Setup

1.  Clone the repository:

    ```bash
    git clone [<repository_url>](https://github.com/Designerpro13/project-paspatch/
    cd PatchWise
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### API Key Configuration

PatchWise utilizes external APIs for certain functionalities, particularly those powered by generative AI. To use the platform, you will need to configure your API keys.

1.  Create a `.env.local` file in the root of the project directory. This file will store your environment variables, including API keys.

2.  Add your API keys to the `.env.local` file in the following format:

    ```dotenv
      GOOGLE_API_KEY=your_google_api_key_here
    # OPENAI_API_KEY=your_openai_api_key_here
    ```

    * Replace `your_api_key_value` with your actual API key.

3.  Ensure that the `.env*.local` entry is present in your `.gitignore` file to prevent your API keys from being committed to your repository.

## 4. Usage

### Running Locally

To run the PatchWise platform locally, use the following command:

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can access the application in your web browser, typically at `http://localhost:3000`.

## 5. Limitations

PatchWise, particularly in its current stage of development and reliance on AI, has certain limitations:

*   **AI Accuracy:** The accuracy of vulnerability analysis, mapping, and patch recommendations is dependent on the quality and capabilities of the underlying AI models. While efforts are made to ensure accuracy, AI can sometimes produce incorrect or irrelevant information.
*   **Data Source Dependency:** The effectiveness of the platform is contingent on the availability and quality of vulnerability data from ingested sources.
*   **API Key Requirement:** Access to AI-powered features requires valid API keys for the respective services.
*   **Continuous Development:** The platform is under continuous development, and some features may be incomplete or subject to change.

Users should exercise discretion and verify critical information provided by the AI.
