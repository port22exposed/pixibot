{ lib, buildNpmPackage, nodejs_latest }:
buildNpmPackage {
  pname = "pixibot";
  version = "0.1.0";

  src = ./.;

  nodejs = nodejs_latest;

  npmDepsHash = lib.fakeHash;
}
