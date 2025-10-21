# ShapleyX Documentation

Welcome to the ShapleyX documentation! 

ShapleyX is a Python package for global sensitivity analysis using Sparse Random Sampling - High Dimensional Model Representation (HDMR) with Group Method of Data Handling (GMDH) for parameter selection and linear regression for parameter refinement.

## Documentation Sections

- **Getting Started**: Installation and basic setup
- **Tutorials**: Step-by-step guides for common tasks
- **How-to Guides**: Solutions to specific problems
- **Reference**: Complete API documentation
- **Explanation**: Background and theory

```python
import shapleyx

# Initialize RS-HDMR analyzer
analyzer = shapleyx.rshdmr(data_file='input_data.csv', polys=[10, 5], method='ard')

# Run the entire analysis pipeline
sobol_indices, shapley_effects, total_index = analyzer.run_all()
```

> ## <strong style="color:#00b8d4; font-size:28px;">AI Script Summary</strong>
> <span style="color:#757575; font-size:18px; display:block; margin-top:1px;">This Jupyter notebook conducts global sensitivity analysis on the Ishigami function, a nonlinear benchmark for uncertainty quantification, using RS-HDMR from the shapleyx library. It generates Sobol-sampled inputs, fits a sparse second-order polynomial surrogate via ARD with cross-validation, and derives sensitivity indices like Sobol, SHAP, PAWN, HX, and deltaX to assess variable contributions and interactions. Key findings reveal X2's strong main effect (Sobol 0.446) and X1-X3 interaction (0.240), with near-perfect model reconstruction (R² ≈ 1.000). </span>
>
> <strong>Authors:</strong> F. R. Bennett &nbsp;&nbsp; <br/><br/>
> <strong>Date:</strong> 17/10/25  &nbsp;&nbsp; <br/><br/>
> <strong>Version:</strong> 1.0<br/><br/>
> 
> <button onclick="handleGitHubAction('frbennett', 'shapleyx', 'Examples/ishigami_new_legendre.ipynb', 'download')">Download File</button>
> 
><button onclick="handleGitHubAction('frbennett', 'shapleyx', 'Examples', 'download')">Download Folder</button>
>
><button onclick="handleGitHubAction('frbennett', 'shapleyx', 'Examples/ishigami_new_legendre.ipynb', 'open')">Open on GitHub</button>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js"></script>
<script>
async function handleGitHubAction(owner, repo, path, action) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const githubUrl = `https://github.com/${owner}/${repo}/tree/main/${path}`;

  if (action === 'open') {
    window.open(githubUrl, '_blank');
    return;
  }

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (Array.isArray(data)) {
    // Directory download
    const zip = new JSZip();
    for (const file of data) {
      if (file.type === "file") {
        const fileRes = await fetch(file.download_url);
        const content = await fileRes.text();
        zip.file(file.name, content);
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${path.split('/').pop()}.zip`;
    link.click();
  } else if (data.type === "file") {
    // Single file download
    const decoded = atob(data.content.replace(/\n/g, ''));
    const blob = new Blob([decoded], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.name;
    link.click();
  } else {
    alert("Unsupported content type or path not found.");
  }
}
</script>



### 1. The main purpose and objectives of the notebook

The notebook focuses on performing global sensitivity analysis for the Ishigami function, a benchmark model in uncertainty quantification that exhibits nonlinear and non-monotonic behavior across three input variables. The primary objective is to generate input-output samples using quasi-Monte Carlo sampling (Sobol sequence) and apply the Random Sampling High-Dimensional Model Representation (RS-HDMR) method from the shapleyx library to approximate the function and derive multiple sensitivity indices. These include Sobol indices (first-order and total-order), SHAP values, PAWN (Plackett-Burman-based sensitivity), HX (high-dimensional extension of Sobol), and DeltaX measures. The analysis aims to rank the importance of inputs $X_1$, $X_2$, and $X_3$ in influencing the output $Y$, while evaluating model fit through cross-validation and bootstrap resampling for confidence intervals. Secondary goals include visualizing data and computing divergence metrics like KL divergence via kernel density estimation for potential distribution comparisons, though the latter appears exploratory and not fully integrated into the core workflow.

### 2. Key code logic and functions implemented

The notebook begins by importing essential libraries: pandas and numpy for data handling, scipy for distance and statistical tools (including qmc for Sobol sampling), shapleyx for RS-HDMR modeling, spotpy (unused in visible cells), matplotlib for potential plotting (not executed), and itertools for combinations (unused here). A utility function get_column_labels(n) generates labels like 'X1' to 'Xn' for $n$ features.

The core function ishigami(m) implements the Ishigami model for $n=3$ inputs uniformly distributed over $[-\pi, \pi]$, with parameters $a=7$ and $b=0.1$. It uses a scrambled Sobol sampler to generate $2^m$ points $S$, transforms them to the input range, and computes the output $Y = \sin(X_1) + a \sin^2(X_2) + b X_3^4 \sin(X_1)$, returning a DataFrame with inputs and $Y$. For $m=8$, this yields 256 samples.

The RS-HDMR model is initialized with dataframe, polynomial degrees [10,5] for orders 1 and 2, 250 ARD iterations, and 'ard_cv' method for automatic relevance determination with cross-validation. The run_all() method transforms data to a unit hypercube, builds 105 basis functions (30 first-order, 75 second-order), performs ARD regression to select 13 active features, and computes Sobol indices (sob), SHAP values (shap), and total indices (total). Performance is assessed via metrics like MAE, MSE, and $R^2$.

Post-fitting, sensitivity indices are extracted: get_hx(1000,500) for HX (normalized delta from histogram overlaps), get_deltax(1000,500) for DeltaX (correlation-based sensitivity via ranks), and get_pawnx(1000,500,100) for PAWN (Kolmogorov-Smirnov statistics from Plackett-Burman designs). Results are aggregated into all_results DataFrame with medians/norms for comparison. Bootstrap resampling (1000 samples) provides 95% confidence intervals for Sobol indices.

An additional standalone function kl_divergence_kde computes Kullback-Leibler divergence between two univariate distributions using Gaussian KDEs, evaluated on a grid with trapezoidal integration: $KL(P||Q) = \int p(x) \log \frac{p(x)}{q(x)} dx$, demonstrated on normal distributions but not applied to the Ishigami data.

### 3. Important findings or results shown in outputs

The Ishigami function generates 256 samples with $Y$ ranging from approximately -3 to 11, showcasing variance of 13.927. The RS-HDMR model fits exceptionally well, achieving a variance ratio of 0.976, test MAE of 0.044, MSE of 0.003, explained variance of 1.000, $R^2=0.9998$, and slope near 1 with $p=0$. ARD converges in 12 iterations, selecting 13 basis functions from 105.

Sensitivity rankings emphasize $X_2$'s dominance: first-order Sobol index $S_{X_2} = 0.446$ (95% CI: 0.445-0.448), total $T_{X_2} = 0.446$. $X_1$ follows with $S_{X_1} = 0.313$ (CI: 0.311-0.315) and interaction $S_{X_1 X_3} = 0.240$ (CI: 0.239-0.242), total $T_{X_1} = 0.553$. $X_3$ is least sensitive with $S_{X_3} \approx 0$ (implicitly low), total $T_{X_3} = 0.240$. SHAP scaled effects align closely: $X_2=0.446$, $X_1=0.433$, $X_3=0.120$.

Other indices reinforce this: PAWN medians show $X_2=0.416$ (highest KS deviation), $X_1=0.284$, $X_3=0.193$; HX norms: $X_1=0.477$, $X_2=0.232$, $X_3=0.292$; DeltaX: $X_2=0.492$, $X_1=0.289$, $X_3=0.219$. The aggregated all_results DataFrame highlights consistent $X_2 > X_1 > X_3$ ordering, with PAWN and DeltaX slightly elevating $X_2$'s relative importance. The KL divergence example yields $KL(P||Q)=0.1355$ and $KL(Q||P)=0.2424$, illustrating asymmetry, but no Ishigami-specific application.

### 4. Overall structure and flow

The notebook follows a linear, exploratory progression across code cells: initial imports establish the environment, followed by the ishigami(m) function definition and sample generation for $m=8$ (256 points), with a DataFrame display. Model fitting via rshdmr.run_all() dominates the middle, outputting transformation details, basis construction (105 functions), ARD progress (CV scores rising to 0.9998), performance stats, and bootstrap completion. Subsequent cells extract and aggregate indices into all_results, displaying intermediate outputs like PAWN KS stats (critical value 0.074, medians exceeding for $X_1,X_2$) and final table. Sobol results are shown via the sob DataFrame, emphasizing active terms. The KL function is appended as a self-contained example with synthetic data output, unrelated to prior flow, suggesting it as a tangential utility. No plots are generated, and empty cells indicate potential pauses or unfinished sections.

### 5. Instructions for use

To use this notebook, ensure dependencies are installed: pip install pandas numpy scipy shapelyx spotpy matplotlib. Set a random seed for reproducibility if needed (sampler uses seed=123). Adjust m in ishigami(m) for sample size (e.g., m=10 for 1024 points; higher m increases computation for RS-HDMR and bootstraps). Run cells sequentially; the model fitting may take seconds to minutes based on n_iter=250 and bootstrap=1000. Modify polys=[10,5] for different polynomial orders, or method='ard' without CV. For custom data, replace ishigami with your DataFrame (features as 'X1'-'Xn', target 'Y'). Extract indices via model.get_* methods, aggregating as shown. The KL function can be called independently: kl_divergence_kde(array_p, array_q). Rerun from the top after changes; outputs like CV scores and CIs are stochastic, so results may vary slightly without fixed seeds in bootstraps.

### 6. Theoretical Description of Methods

The Ishigami function serves as a test case for sensitivity analysis, defined as $Y = \sin(X_1) + a \sin^2(X_2) + b X_3^4 \sin(X_1)$, where $X_i \sim U[-\pi, \pi]$, $a=7$ amplifies $X_2$'s quadratic nonlinearity, and $b=0.1$ introduces a weak $X_3$-$X_1$ interaction, yielding theoretical Sobol indices $S_{X_1} \approx 0.314$, $S_{X_2} \approx 0.442$, $S_{X_3} \approx 0$, $S_{X_1 X_3} \approx 0.244$.

RS-HDMR approximates multivariate functions via hierarchical expansion: $f(\mathbf{x}) = \sum_{i=1}^n f_i(x_i) + \sum_{i<j} f_{ij}(x_i,x_j) + \cdots + f_{12\ldots n}(\mathbf{x})$, truncated at low orders for tractability. Random sampling anchors expansions at reference points (here, unit hypercube via min-max scaling), using polynomial bases (e.g., Legendre) regressed via ARD, a Bayesian sparsity inducer that shrinks irrelevant coefficients with hyperparameters updated by evidence maximization and CV.

Sobol indices decompose output variance: first-order $S_i = \frac{\mathrm{Var}[E[Y|X_i]]}{\mathrm{Var}[Y]}$, total-order $T_i = 1 - \frac{\mathrm{Var}[E[Y|\mathbf{X}_{\sim i}]]}{\mathrm{Var}[Y]}$, estimated from RS-HDMR components with bootstrap CIs. SHAP values attribute predictions via game theory, scaled here for comparison. PAWN uses maximum KS distance between conditional $Y|X_i$ CDFs and unconditional CDF over Plackett-Burman designs. HX extends Sobol by binning inputs and measuring histogram overlap losses (delta = 1 - overlap). DeltaX applies max correlation between $Y$ ranks and fixed input ranks. KL divergence quantifies distribution shift: $KL(P||Q) = \int_{-\infty}^{\infty} p(x) \log \frac{p(x)}{q(x)} dx \geq 0$, approximated numerically here for exploratory use.

No web references were used in this analysis.

An interesting fact: The Ishigami function was originally proposed in 1993 to challenge correlation-based sensitivity measures, as its non-monotonicity leads $X_3$ to have low first-order but high total sensitivity due to interactions, highlighting the need for variance-based methods like Sobol (Saltelli, A., et al., "Variance based sensitivity indices as measures of model quality in chemistry," Chemometrics and Intelligent Laboratory Systems, 1993).  

