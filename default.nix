{ lib, buildNpmPackage }:
buildNpmPackage {
  pname = "pixibot";
  version = "0.1.0";

  src = ./.;

  npmDepsHash = lib.fakeHash;
}
