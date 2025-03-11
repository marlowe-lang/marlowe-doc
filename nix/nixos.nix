self: { lib, config, pkgs, ... }:
let
  inherit (lib) mkOption types mapAttrs';
  inherit (pkgs) writeTextDir symlinkJoin;

  docs-websiteOptions = { name, ... }: {
    options = {
      domain = mkOption {
        type = types.str;
        default = name;
        description = "The domain to host the docs-website";
      };

      flake = mkOption {
        type = types.attrs;
        default = self;
        description = "A Nix Flake containing the docs-website";
      };

      useSSL = mkOption {
        type = types.bool;
        default = true;
        description = "Whether to use SSL for the docs-website";
      };
    };
  };

  mkRoot = name: { flake, ... }:
    builtins.trace "flake.packages.${pkgs.system}: ${builtins.toJSON flake.packages.${pkgs.system}}.default" flake.packages.${pkgs.system}.default;

in
{
  options = {
    marlowe.docs-website = mkOption {
      type = types.attrsOf (types.submodule docs-websiteOptions);
      default = { };
      description = "Marlowe docs-website instances to run";
    };
  };

  config = {
    http-services.static-sites = mapAttrs'
      (name: docs-website: {
        name = "marlowe-docs-website-${name}";
        value = {
          inherit (docs-website) domain;
          useSSL = docs-website.useSSL;
          root = mkRoot name docs-website;
        };
      })
      config.marlowe.docs-website;
  };
}
