import { RepoFileNode, EcosystemRegistry } from "../types";

export const ECOSYSTEM_REGISTRY: EcosystemRegistry = {
  name: "the-ledger",
  display_name: "THE LEDGER",
  category: "Entertainment Technology",
  division: "T&F Media",
  description: "AI-powered music rights education platform helping artists understand contracts, ownership, and revenue before they sign.",
  tagline: "Know your rights before you sign.",
  foundation: "tf-standard-kit",
  security_baseline: true,
  ci_enabled: true,
  status: "development"
};

export const REPOSITORY_TREE: RepoFileNode = {
  name: "the-ledger",
  path: "the-ledger",
  type: "directory",
  description: "Root repository structure for THE LEDGER - Music Rights Education Platform",
  children: [
    {
      name: "README.md",
      path: "the-ledger/README.md",
      type: "file",
      language: "markdown",
      description: "Platform overview and mission statement",
      content: `# THE LEDGER

## Know your rights before you sign.

THE LEDGER is an AI-powered music rights education platform designed to help artists understand recording, publishing, producer, management, and distribution agreements.

The goal is simple:
Help creators understand the business behind their music before signing contracts.

---

## The Problem
Many young artists create music before understanding:
- Who owns the recording
- Who owns the songwriting
- How royalties are divided
- What rights they are giving away
- How long agreements last

Complex contracts can prevent artists from understanding their own careers.

---

## The Solution
THE LEDGER translates music agreements into simple explanations.

Artists can learn:
- What a contract section means
- Why it matters
- What questions to ask
- How money flows through a deal

---

## Core Features

### AI Contract Education
Explains music agreements in simple language using Gemini 3.6 Flash reasoning models.

### Rights Graph
Maps ownership, royalties, obligations, and parties involved in interactive visual network graphs.

### Revenue Waterfall
Simulates how money moves between artists, labels, publishers, producers, and distributors under varying recoupment scenarios.

### Music Business Learning
Educational modules covering recording deals, publishing, producer agreements, management, and distribution.

---

## Mission
Empower the next generation of artists with knowledge before they sign.

---

## Disclaimer
THE LEDGER provides educational information and does not replace professional legal advice.`
    },
    {
      name: "LICENSE",
      path: "the-ledger/LICENSE",
      type: "file",
      language: "plaintext",
      description: "Apache 2.0 Open Source License",
      content: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

Copyright 2026 THE LEDGER Contributors & T&F Media Division.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0`
    },
    {
      name: "ecosystem-registry.json",
      path: "the-ledger/ecosystem-registry.json",
      type: "file",
      language: "json",
      description: "T&F Ecosystem Registry entry",
      content: JSON.stringify(ECOSYSTEM_REGISTRY, null, 2)
    },
    {
      name: "docs",
      path: "the-ledger/docs",
      type: "directory",
      children: [
        {
          name: "product-vision.md",
          path: "the-ledger/docs/product-vision.md",
          type: "file",
          language: "markdown",
          description: "Product Vision Document",
          content: `# THE LEDGER Product Vision

## Mission
Create a simple way for artists to understand music contracts and business decisions.

## Target Users
Primary:
- Teen musicians
- Independent artists
- Songwriters
- Producers

Secondary:
- Parents
- Music educators
- Artist managers

## Product Principles
1. Education first
2. Artist empowerment
3. Simple explanations
4. Transparency
5. Responsible AI`
        },
        {
          name: "architecture.md",
          path: "the-ledger/docs/architecture.md",
          type: "file",
          language: "markdown",
          description: "System Architecture Document",
          content: `# THE LEDGER Architecture

## Overview
THE LEDGER uses AI and structured data systems to explain music agreements.

## Core Components

### Contract Intelligence Pipeline
Four-pass process:
1. Contract ingestion (PDF/Text/Image OCR)
2. Rights extraction (Master vs Composition identification)
3. Relationship mapping (Graph node/edge generation)
4. Educational explanation (Gemini 3.6 Flash translation & Red Flag identification)

### Rights Graph
Represents:
Artist → Label → Publisher → Producer → Distributor

### Revenue Waterfall
Models:
Revenue sources → Splits → Recoupment/Advances → Payments → Ownership outcomes`
        },
        {
          name: "user-flow.md",
          path: "the-ledger/docs/user-flow.md",
          type: "file",
          language: "markdown",
          description: "User Interaction & Workflow Document",
          content: `# THE LEDGER User Flow

1. **Ingest Phase**: Artist pastes or uploads contract text or chooses from 5 preset templates.
2. **Analysis Phase**: AI breaks down clauses into plain English, highlighting High/Medium/Low Red Flags.
3. **Visualization Phase**:
   - Rights Graph maps parties and copyright splits.
   - Revenue Waterfall calculates net artist payout based on customizable advances and royalty rates.
4. **Learning Phase**: Artist explores interactive lessons and quizzes to build long-term music business literacy.`
        },
        {
          name: "roadmap.md",
          path: "the-ledger/docs/roadmap.md",
          type: "file",
          language: "markdown",
          description: "Product Roadmap",
          content: `# THE LEDGER Roadmap

- **Q1 2026**: Core AI Analyzer, Rights Graph & Revenue Waterfall Simulator.
- **Q2 2026**: Mobile-optimized offline contract scanner & PDF OCR engine.
- **Q3 2026**: Entertainment attorney connection portal & legal aid matching.
- **Q4 2026**: Global multi-currency distribution waterfall adapters.`
        },
        {
          name: "music-education",
          path: "the-ledger/docs/music-education",
          type: "directory",
          children: [
            {
              name: "recording-contracts.md",
              path: "the-ledger/docs/music-education/recording-contracts.md",
              type: "file",
              language: "markdown",
              content: `# Recording Contracts Guide\n\nKey takeaways: Always verify master ownership retention, 360 ancillary participation, and cross-collateralization provisions.`
            },
            {
              name: "publishing.md",
              path: "the-ledger/docs/music-education/publishing.md",
              type: "file",
              language: "markdown",
              content: `# Music Publishing Guide\n\nUnderstand performance vs mechanical vs sync royalties, ASCAP/BMI registration, and admin vs co-publishing split mechanics.`
            },
            {
              name: "producer-agreements.md",
              path: "the-ledger/docs/music-education/producer-agreements.md",
              type: "file",
              language: "markdown",
              content: `# Producer Agreements Guide\n\nLearn how producer points (1-5%), record-one recoupment, and Letters of Direction (LOD) operate.`
            }
          ]
        },
        {
          name: "technical",
          path: "the-ledger/docs/technical",
          type: "directory",
          children: [
            {
              name: "rights-graph.md",
              path: "the-ledger/docs/technical/rights-graph.md",
              type: "file",
              language: "markdown",
              content: `# Rights Graph Specification\n\nDirected acyclic graph schema representing copyright relationships, royalty channels, and obligations.`
            },
            {
              name: "revenue-waterfall.md",
              path: "the-ledger/docs/technical/revenue-waterfall.md",
              type: "file",
              language: "markdown",
              content: `# Revenue Waterfall Math Engine\n\nSequential deduction algorithm: Gross Revenue -> Distro Fee -> Net Receipts -> Advance Recoupment -> Net Artist Payout.`
            },
            {
              name: "ai-pipeline.md",
              path: "the-ledger/docs/technical/ai-pipeline.md",
              type: "file",
              language: "markdown",
              content: `# AI Pipeline Architecture\n\nPowered by Google GenAI Gemini 3.6 Flash model with JSON schema enforcement for zero-hallucination legal translation.`
            }
          ]
        }
      ]
    },
    {
      name: "packages",
      path: "the-ledger/packages",
      type: "directory",
      children: [
        {
          name: "rights-graph",
          path: "the-ledger/packages/rights-graph",
          type: "directory",
          children: [
            {
              name: "package.json",
              path: "the-ledger/packages/rights-graph/package.json",
              type: "file",
              language: "json",
              content: `{ "name": "@the-ledger/rights-graph", "version": "1.0.0" }`
            }
          ]
        },
        {
          name: "contract-parser",
          path: "the-ledger/packages/contract-parser",
          type: "directory",
          children: [
            {
              name: "package.json",
              path: "the-ledger/packages/contract-parser/package.json",
              type: "file",
              language: "json",
              content: `{ "name": "@the-ledger/contract-parser", "version": "1.0.0" }`
            }
          ]
        },
        {
          name: "revenue-waterfall",
          path: "the-ledger/packages/revenue-waterfall",
          type: "directory",
          children: [
            {
              name: "package.json",
              path: "the-ledger/packages/revenue-waterfall/package.json",
              type: "file",
              language: "json",
              content: `{ "name": "@the-ledger/revenue-waterfall", "version": "1.0.0" }`
            }
          ]
        }
      ]
    },
    {
      name: "security",
      path: "the-ledger/security",
      type: "directory",
      children: [
        {
          name: "threat-model.md",
          path: "the-ledger/security/threat-model.md",
          type: "file",
          language: "markdown",
          content: `# Threat Model & Data Privacy\n\nAll uploaded contracts are processed ephemerally on server-side sandboxes. No personal contract text is logged or stored without user permission.`
        },
        {
          name: "compliance.md",
          path: "the-ledger/security/compliance.md",
          type: "file",
          language: "markdown",
          content: `# Compliance Policy\n\nAdheres to T&F Standard Kit Security Baseline and strict AI Studio guidelines.`
        }
      ]
    },
    {
      name: "docker-compose.yml",
      path: "the-ledger/docker-compose.yml",
      type: "file",
      language: "yaml",
      content: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - NODE_ENV=production`
    }
  ]
};
