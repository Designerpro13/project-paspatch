# PatchWise Application Demo Script

## 1. Introduction & Dashboard Overview

**Goal**: Introduce the application and provide a high-level overview of the current security posture.

**Steps**:
1.  **Open the application to the Dashboard page.**
2.  **Introduction**: "Welcome to PatchWise, an intelligent vulnerability management platform. What you're seeing is the main dashboard, which gives us a real-time, at-a-glance view of our organization's security posture."
3.  **Key Metrics**: Point to each of the four main stat cards.
    *   "We're currently tracking over 1,200 total vulnerabilities."
    *   "We have 89 critical issues that require immediate attention."
    *   "The team has successfully applied over 570 patches."
    *   "And we're monitoring a total of 2,450 assets across our network."
4.  **Visual Overview**:
    *   Point to the **Vulnerability Overview** chart. "This chart gives us a visual breakdown of vulnerabilities by severity, showing a clear picture of where our risks lie."
    *   Point to the **High-Priority Patches** table. "And this table lists the most critical patches that need to be addressed right away, showing the specific CVE, the affected asset, and the vulnerable service."

## 2. AI-Powered Vulnerability Chat

**Goal**: Showcase the natural language chat interface for querying security information.

**Steps**:
1.  **Navigate to the "Vulnerability Chat" page.**
2.  **Explanation**: "One of our most powerful features is the AI-powered chat. Instead of digging through databases, you can simply ask questions in plain English."
3.  **Demonstration**:
    *   Type a question into the chat box, such as: **"What is CVE-2023-3390 and how can I mitigate it?"**
    *   Press send and wait for the response.
    *   **Highlight the Markdown response**: "As you can see, the AI provides a detailed, easy-to-read summary, including a description of the vulnerability and clear, actionable steps for mitigation, all formatted with Markdown for clarity."

## 3. The Data Ingestion Workflow

**Goal**: Explain how PatchWise gets its data and intelligently processes it.

**Steps**:
1.  **Navigate to the "Ingest Data" page.**
    *   **Explanation**: "The intelligence of PatchWise starts with its data. This is where we can ingest vulnerability data from various sources, like the National Vulnerability Database (NVD) or vendor advisories."
    *   **Show the input fields**: "We simply specify the source and paste in the raw data, which is often in a complex JSON format."

2.  **Navigate to the "Scan Parser" page.**
    *   **Explanation**: "We can also ingest data from our own network scans. Here, we can paste the XML output from a standard Nmap scan."
    *   **Show the input**: "The AI will parse this complex XML to identify every service, version, and open port on our network."

3.  **Navigate to the "Asset Mapping" page.**
    *   **Explanation**: "Once we have vulnerability and asset data, the AI performs a crucial step: mapping vulnerabilities to our specific assets. It uses fuzzy matching to correlate software from our inventory with known vulnerabilities."

## 4. Intelligent Prioritization and Advice

**Goal**: Demonstrate the core value proposition of the app—AI-driven patch prioritization.

**Steps**:
1.  **Navigate to the "Prioritize Patches" page.**
    *   **Explanation**: "This is where the magic happens. Based on the network scan data we ingested, the AI analyzes outdated services and generates a prioritized list of patches."
    *   **Show the table**: "It doesn't just list them; it tells us the priority (Critical, High, etc.), the service, the current version, the recommended patch, and the rationale behind the recommendation, often citing specific CVEs."

2.  **Navigate to the "Patch Advisor" page.**
    *   **Explanation**: "For a more customized analysis, we can use the Patch Advisor. Here, we can provide specific vulnerability analysis and describe the criticality of our assets."
    *   **Show the input fields**: "For example, we can tell the AI that a specific web server is a high-priority, public-facing asset."
    *   **Show the output**: "The AI then provides tailored recommendations and a detailed justification, ensuring we focus our efforts where they matter most."

## 5. Reporting and Conclusion

**Goal**: Show how the insights are consolidated into a shareable report.

**Steps**:
1.  **Navigate to the "Security Reports" page.**
2.  **Explanation**: "Finally, all of this data and analysis is compiled into a comprehensive and easy-to-read Security Posture Report."
3.  **Walk through the report**: Point out the executive summary, key metrics, the vulnerability chart, and the actionable intelligence table.
4.  **Print Feature**: "This report can be easily printed or saved as a PDF to be shared with stakeholders."
5.  **Conclusion**: "PatchWise streamlines the entire vulnerability management lifecycle, from data ingestion to actionable reporting, using the power of generative AI to help security teams work smarter and faster."
