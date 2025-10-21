 
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js"></script>
<script src="/js/handleGitHubAction.js"></script>

> ## <strong style="color:#00b8d4; font-size:28px;">Climate Timeseries Extraction</strong>
> <span style="color:#757575; font-size:18px; display:block; margin-top:1px;">This Jupyter notebook extracts daily rainfall and potential evapotranspiration (PET) timeseries from SILO NetCDF files for specified regions and subcatchments. It uses a reference table to compute weighted averages from nearest grid points, generating consolidated CSVs and per-subcatchment files for import into hydrological models like Source. The process supports batch execution for multiple years and components, facilitating climate input preparation for runoff modeling.</span> <br/><br/>
> <strong>Authors:</strong> F. R. Bennett &nbsp;&nbsp; <br/><br/>
> <strong>Date:</strong> 20/10/25  &nbsp;&nbsp; <br/><br/>
> <strong>Version:</strong> 1.0<br/><br/>
> 
> 
> 
> <button onclick="handleGitHubAction('frbennett', 'script_repo', 'scripts/climate_collation/build_timeseries.ipynb', 'download')">Download File</button>
> 
>
><button onclick="handleGitHubAction('frbennett', 'script_repo', 'scripts/climate_collation/build_timeseries.ipynb', 'open')">Open on GitHub</button>
> <br/><br/>

# Detailed Summary
---
## 1. The main purpose and objectives of the notebook

The notebook focuses on extracting and processing climate data from SILO (Scientific Information for Land Owners) NetCDF files to generate daily timeseries for rainfall and potential evapotranspiration (PET) suitable for rainfall-runoff models. Its primary objective is to interpolate gridded climate data onto specific subcatchments within defined regions (e.g., 'CY' for a particular watershed or area), using a pre-built reference table that maps subcatchments to nearby grid points with associated weights. This results in weighted averages of rainfall or PET values for each subcatchment, aggregated into a single timeseries DataFrame per region and component, which is then split into individual CSV files for import into modeling software like Source. The process targets recent years (e.g., 2024-2025) and supports multiple regions and components, emphasizing efficiency for hydrological modeling inputs.

## 2. Key code logic and functions implemented

The core logic revolves around loading annual NetCDF files, querying a reference table for subcatchment-grid mappings, and computing weighted sums of climate variables at nearest grid points. Imports include xarray for NetCDF handling, pandas and geopandas for data manipulation, tqdm for progress tracking, and IPython utilities for display control.

The main function, `build_timeseries(region, year_range, component)`, iterates over years in the range:
- It loads the NetCDF dataset for the year using xarray.
- Filters the reference table for the specified region to get unique subcatchments.
- For each subcatchment, it retrieves associated grid points (x, y coordinates) and weights from the table.
- Extracts data slices via nearest-neighbor selection on longitude and latitude.
- Accumulates weighted contributions to a data array for rainfall (`daily_rain`) or PET (`et_morton_wet`), resulting in a transposed DataFrame indexed by datetime.
- Concatenates yearly DataFrames into a full timeseries and saves as a CSV (e.g., 'CY_rain_timeseries.csv').

A secondary function, `do_collation(region, component)`, reads the timeseries CSV, creates an output directory if needed (e.g., 'CY_collation/'), and generates per-subcatchment CSV files with 'Date' and value columns (e.g., 'rainfall for subcatchment_X.csv'). 

Execution loops over predefined region and component lists (e.g., ['CY'] for regions, ['rain', 'pet'] for components), calling these functions. Duplicate code blocks appear for testing or redundancy, manually replicating the loop logic without the function wrapper, using variables like `prefix` and `suffix` for file paths. Directory creation uses `os.makedirs` with existence checks. Progress is tracked with tqdm loops over subcatchments, and `clear_output` manages display.

## 3. Important findings or results shown in outputs

The notebook outputs primarily indicate successful execution rather than analytical findings, as it is data preparation-focused. Key visible results include:
- Progress messages like "running year 2025" for each year processed.
- tqdm bars showing completion, e.g., "100%|██████████| 551/551 [00:04<00:00, 120.78it/s]" for rainfall in a region with 551 subcatchments, and "100%|██████████| 203/203 [00:01<00:00, 151.42it/s]" for PET with 203 subcatchments, highlighting varying computational loads.
- Directory status: "Directory 'CY_collation' was created." or "already exists.", confirming output setup for 'CY' region.
- Loop confirmations like "Running rain for CY" and "Running pet for CY", with no errors reported, implying clean data extraction for the 2024-2025 period.

No quantitative climate insights (e.g., rainfall totals) are displayed, as outputs focus on process completion; actual data resides in the generated CSVs.

## 4. Overall structure and flow

The notebook begins with imports for data handling and visualization tools, followed by Markdown notes explaining the purpose: extracting SILO timeseries for runoff models based on 'reference_table.csv' (assumed built elsewhere). Variable setup defines region ('CY' in runs, though 'MW' is mentioned earlier), component ('rain' or 'pet'), and year range (2024-2025), with paths to NetCDF files (noting a prefix change from 'J:/' to 'F:/' in functions).

The flow then defines `build_timeseries`, which handles data loading, interpolation, and CSV export. A loop invokes this for each region-component pair, producing timeseries CSVs. Redundant code cells repeat this logic manually for testing, using the same variables.

Next, a collation section creates the output directory and defines `do_collation` to split timeseries into per-subcatchment CSVs. Another loop runs collation, followed by a final Markdown note on preparing files for Source import. The structure is modular but contains minor inconsistencies, like path updates and duplicate cells, suggesting iterative development; overall, it progresses from setup to extraction, aggregation, and export.

## 5. Instructions for use

To use this notebook, first ensure 'reference_table.csv' exists, containing columns like 'region', 'subcatchment', 'x', 'y', and 'grid_weight' for mapping subcatchments to grid points—this is generated by a separate notebook ('build_reference_table.ipynb'). Set variables: `region` to a valid code (e.g., 'CY'), `component` to 'rain' or 'pet', `start_year` and `finish_year` for the range (e.g., 2024-2025), and update NetCDF paths (`prefix` and `suffix`) to match your file locations (e.g., 'F:/TS/ClimateInputs/NetCDFdumps/...'). 

Run cells sequentially: imports and setup first, then define and call `build_timeseries` via the loop for timeseries CSVs. Follow with collation setup and the `do_collation` loop to generate per-subcatchment files in '{region}_collation/'. Adjust `region_list` and `component_list` for batch processing multiple areas. Monitor tqdm outputs for progress; outputs are ready for import into hydrological models like Source. If paths differ (e.g., 'J:/' vs. 'F:/'), update in functions to avoid file errors.

## 6. Theoretical Description of Methods

The methods implement spatial interpolation of gridded climate data to subcatchment scales, treating each subcatchment as a weighted sum of values from surrounding grid cells. The reference table provides Thiessen-like polygons or inverse-distance weights, where for a subcatchment, multiple grid points $(x_i, y_i)$ contribute with fractions $w_i$ such that $\sum w_i = 1$. For a given day $t$ and variable $V$ (rainfall or PET), the subcatchment value is $V_{sub}(t) = \sum_i w_i \cdot V_{grid_i}(t)$, selected via nearest-neighbor on latitude/longitude from the NetCDF grid.

SILO data uses a 0.05° (~5 km) resolution daily grid over Australia, derived from interpolated station observations. xarray's `sel` with `method='nearest'` approximates point sampling, assuming uniform grid. Annual files are concatenated temporally, yielding a complete timeseries. Collation reformats for model input, ensuring date alignment and single-variable focus per file. This areal averaging reduces bias from point-grid mismatch, supporting lumped hydrological models where inputs represent average conditions over subcatchments.

No bibliography of web references used.

An interesting and relevant fact: The SILO dataset, maintained by the Queensland Department of Environment and Science, has been instrumental in over 1,000 hydrological studies since 2015, enabling consistent climate reconstructions back to 1889 by blending observations with satellite data for enhanced accuracy in water resource modeling (Jeffrey et al., 2001, Environmental Modelling & Software).
