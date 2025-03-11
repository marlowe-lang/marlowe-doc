{ repoRoot, pkgs, lib,  ... }:

pkgs.buildNpmPackage {
  pname = "marlowe-docs-website";
  version = "0.1.0";
  npmInstallFlags = [ "--include=dev" ];
  npmFlags = ["--legacy-peer-deps"];

  src = lib.sourceByRegex ../. [
    "^docs.*"
    "^docusaurus.config.ts$"
    "^package-lock.json$"
    "^package.json$"
    "^pages.*"
    "^sidebar-tutorial.mjs$"
    "^sidebars.ts$"
    "^src.*"
    "^static.*"
    "^tsconfig.json$"
    "^tutorials.*"
  ];

  npmDepsHash = import ./gen/npm-deps-hash.nix;

  # Next.js requires this during build
  NODE_ENV = "production";

  buildPhase = ''
    export HOME=$(mktemp -d)
    npm run build
  '';

  installPhase = ''
    mkdir -p $out
    cp -r build/* $out/
  '';

  # These are needed because we handle the build and install phases ourselves
  dontNpmBuild = true;
  dontNpmInstall = false;
}
