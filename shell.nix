{
  mkShellNoCC,

  # extra tooling
  eslint_d,
  prettierd,
  typescript,

  callPackage,
}:
let
  defaultPackage = callPackage ./default.nix { };
in
mkShellNoCC {
  inputsFrom = [ defaultPackage ];
}
