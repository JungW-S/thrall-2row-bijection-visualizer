# The Map xi

This is a serverless browser demo for the bijection

```text
xi = Phi_0 o Omega o Psi_U
```

from `manuscript/main.tex`.

The browser runs the JavaScript implementation directly. Sage is not used by
the webpage; Sage is only the reference implementation for checking the code.

## Run Locally

From this directory:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/
```

This is only a static file server. It does not compute anything on the server.
All tableau computations happen in the browser.

## Input Format

Enter one row of the standard Young tableau per line, for example:

```text
1 2 4 7 9
3 5 10
6 8
```

If `T` lies in `SYT^=(2n)`, the page computes the map `xi` from the paper.

If the input is an even-size SYT but `T` is not in `SYT^=(2n)`, the page
displays a warning and continues after replacing `U` by `rect(S)`, where
`S=st(T_[n+1,2n])`. This display is a continuation of the construction, not
the map `xi(T)` from the paper.

## Random Input

The page can generate a random element of `SYT^=(2n)` for `1 <= n <= 100`.
For `n <= 5`, the generator enumerates the finite set exactly, caches it for
the chosen `n`, and samples uniformly from that list. For larger `n`, it uses
the inverse of the tableau-switching construction to build a valid element
directly; this is fast and varied, but it is not intended to be a uniform
sample from the whole set.
Large inputs near the upper bound may take a few seconds because the page also
computes and stores the full sequence of intermediate tableaux.

## Test

On macOS, the JavaScriptCore runtime can run the reference test:

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc test_core.mjs
```
