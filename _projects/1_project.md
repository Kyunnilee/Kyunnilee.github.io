---
layout: page
title: The Cheese Touch! A Temperature-Dependent Simulation of Melting Cheese
description: CS184: Foundations of Computer Graphics, Final Project. We built a visually compelling simulation of melting cheese using particle systems and rendering techniques!
img: assets/img/1.jpg
importance: 1
category: UC Berkeley
related_publications: false
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/1.jpg" title="Teaser image of cheese melting simulation" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Teaser image showing realistic cheese melting rendered using surfel texturing and marching cubes surface reconstruction.
</div>

## Project Overview

This final project implements a temperature-dependent cheese simulation that mimics realistic melting behavior. Our project combines a particle-based deformation system (phyxels), surface reconstruction via marching cubes, and surfel-based rendering for visual detail.

We aimed to capture both the physical plausibility and visual aesthetics of cheese melting, including:

- Elastic and plastic deformation behavior
- Heat propagation through particles
- Surface geometry evolution using marching cubes
- Texture and shading details via surfels

## Features

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/1.jpg" title="Surface grid and volume layout" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/1.jpg" title="Rendering pipeline with surfels" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<div class="caption">
  Left: The grid layout of the cheese volume with heating zones. Right: The surfel rendering pipeline for surface and shading details.
</div>

## Core Implementation Highlights

- **Phyxels (Physical Particles):** Each cheese volume is modeled as a grid of particles with spring-like forces, simulating elastic and melting behavior.
- **Heat Propagation:** Heat is simulated via a scalar field over time, affecting the deformation of particles.
- **Marching Cubes Surface Extraction:** The dynamic cheese surface is reconstructed frame-by-frame.
- **Surfel Rendering:** We used surfels to add texture and shading, giving the cheese a soft, detailed appearance.

## Reflections

This project was both technically and artistically fulfilling. We explored simulation stability, volume-based rendering, and surfel shading from research papers, including:

- *Point-Based Animation of Elastic, Plastic, and Melting Objects*
- *Surfels: Surface Elements as Rendering Primitives*

## Team

This project was developed by Heekyung Lee and Jaewon Hur as part of CS 184/284A: Foundations of Computer Graphics at UC Berkeley.

You can view the full interactive webpage [here](https://cal-cs184-student.github.io/hw-webpages-jaewonheekyung/final_project/index.html).
