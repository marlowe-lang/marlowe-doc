// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'introduction',
        'getting-started-with-the-marlowe-playground',
        'marlowe-language-guide',
        'writing-marlowe-with-blockly',
        'using-the-haskell-editor',
        'using-the-javascript-editor',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: [
        'tutorials/tutorials-overview',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: [
        'examples/contract-examples',
        'examples/runtime-examples',
        'examples/cli-tool-examples',
        'examples/cli-cookbook',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/dsl',
        'development/platform',
        'development/playground',
        'development/runtime',
        'development/cli',
        'development/lambda',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise',
      collapsed: false,
      items: [
        'enterprise/integration',
      ],
    },
    'faq',
  ],
};

module.exports = sidebars;
