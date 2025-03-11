import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: "Marlowe",
  tagline: "Peer to peer financial agreements",
  favicon: "img/favicon.ico",
  url: "https://play.marlowe.iohk.io/",
  baseUrl: "/",
  organizationName: "marlowe-lang", // Usually your GitHub org/user name.
  projectName: "marlowe-doc", // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themes: [
    "@docusaurus/theme-mermaid",
    [
      "@easyops-cn/docusaurus-search-local",
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        indexBlog: true,
        indexPages: true,
      }
    ]
  ],
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "tutorials",
        path: "tutorials",
        routeBasePath: "tutorials",
        sidebarPath: "./sidebar-tutorial.mjs",
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/marlowe-lang/marlowe-doc/edit/main',
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "",
      logo: {
        alt: "Marlowe Logo",
        src: "img/marlowe-logo-primary-black-purple.svg",
        srcDark: "img/marlowe-logo-primary-white-purple.svg",
        href: "https://marlowe-lang.org",
      },
      items: [
        {
          type: "doc",
          docId: "introduction",
          position: "left",
          label: "Documentation",
        },
        {
          to: "tutorials",
          position: "left",
          label: "Tutorials",
        },
        {
          type: "dropdown",
          label: "Community",
          position: "left",
          items: [
            {
              label: "Github",
              href: "https://github.com/marlowe-lang",
            },
            {
              label: "Stack Exchange",
              href: "https://cardano.stackexchange.com/questions/tagged/marlowe",
            },
            {
              label: "Discord",
              href: "https://discord.com/channels/826816523368005654/936295815926927390",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/marlowe_io",
            },
          ],
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
