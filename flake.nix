{
  description = "Marlowe Blog";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    pre-commit-hooks-nix.url = "github:hercules-ci/pre-commit-hooks.nix/flakeModule";
    pre-commit-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs = inputs@{ flake-parts, ... }: flake-parts.lib.mkFlake { inherit inputs; } {
    imports = [
      inputs.pre-commit-hooks-nix.flakeModule
      inputs.treefmt-nix.flakeModule
    ];
    systems = [ "x86_64-linux" "aarch64-darwin" ];
    perSystem = { config, self', inputs', pkgs, system, lib, ... }: {
      treefmt = {
        projectRootFile = "flake.nix";
        flakeFormatter = true;
        programs = {
          prettier = {
            enable = true;
          };
        };
      };

      packages.default = pkgs.callPackage ./nix/default.nix {
        repoRoot = ./.;
        inherit inputs pkgs lib system;
      };

      devShells.default =
        let
          name = "marlowe-blog";
        in pkgs.mkShell {
          nativeBuildInputs = [
            config.treefmt.build.wrapper
          ]
          ;
          shellHook = ''
            echo 1>&2 "Welcome to the development shell!"
            export PS1='\[\033[1;32m\][${name}:\w]\$\[\033[0m\] '
          '';
          name = name;
          packages = with pkgs; [
            nodejs
            html-tidy
            nodePackages.npm
            nodePackages.typescript
            nodePackages.typescript-language-server
            prefetch-npm-deps
            python3Packages.pypdf2
          ];
      };
    };
    flake = {
      nixosModules.default = import ./nix/nixos.nix inputs.self;
    };
  };

  nixConfig = {
    extra-substituters = [
      "https://cache.iog.io"
    ];
    extra-trusted-public-keys = [
      "hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ="
    ];
    allow-import-from-derivation = true;
  };

}
