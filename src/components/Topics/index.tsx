import React from 'react';

import Link from '@docusaurus/Link';
import ArrowRight from '@site/static/icons/arrow_right.svg';
import Brain from '@site/static/icons/brain.svg';
import Book from '@site/static/icons/book.svg';
import Cube from '@site/static/icons/cube.svg';
import Puzzle from '@site/static/icons/puzzle.svg';
import Scroll from '@site/static/icons/scroll.svg';
import Tool from '@site/static/icons/tools.svg';

import styles from './styles.module.scss';

function Topics() {
  return (
    <div className={styles.gallery}>
      <div className="sub-heading">
        
          <p>

          Marlowe is a pioneering ecosystem within the Cardano blockchain, designed to cater to both seasoned developers and those with limited coding experience. 
          <br />
          <br />
          Marlowe stands out by offering a unique <a href="../../../docs/platform-and-architecture/dsl"><strong>domain-specific language (DSL)</strong></a> that abstracts away the complexities of blockchain programming, making it accessible to both developers and business professionals alike. It simplifies the process of writing complex, secure, and verifiable smart contracts tailored for financial applications.
          <br />
          <br />
          The <a href="../../../docs/developer-tools/playground"><strong>Marlowe Playground</strong></a> is a key component of the ecosystem, providing an intuitive web interface where users can write, simulate, and test their smart contracts without writing a single line of code by using the drag-and-drop coding tool, Blockly. For those with programming experience, Marlowe also offers the ability to write contracts in JavaScript, Haskell, and Marlowe. 
          <br />
          <br />
          <a href="../../../docs/getting-started/runner"><strong>Marlowe Runner</strong></a> is an easy-to-use tool that facilitates the deployment and execution of Marlowe contracts on the blockchain, requiring no command-line expertise. With Marlowe Runner, you can deploy contracts created in the Marlowe Playground, test them, and interact with them in a simulated environment before committing to mainnet.
          <br />
          <br />
          The <a href="../../../docs/developer-tools/ts-sdk/ts-sdk-intro"><strong>TypeScript SDK (TS-SDK)</strong></a> for Marlowe is an extensive toolkit that supports developers in building and integrating decentralized applications (DApps) with Marlowe smart contracts. The TS-SDK includes JavaScript and TypeScript libraries that streamline the development process, offering features such as wallet connectivity, integration with the Marlowe Runtime, and abstractions that simplify the interaction between wallets and the Runtime. 
          <br />
          <br />
          See the <a href="../../../docs/user-journey/marlowe-ecosystem"><strong>user journey</strong></a> to learn more or <a href="../../../docs/getting-started/learning-marlowe"><strong>get started</strong></a> with development now. 
          </p>
        
      </div>
      <div className="sub-heading">
        <h3>Popular topics</h3>
      </div>
      <div className={styles.card}>
        <div className="card-header">
          <Puzzle />
          <h4>Infrastructure</h4>
        </div>
        <p>Learn about the different components of Marlowe for deploying smart contracts in testnet and mainnet</p>
        <Link to="platform-and-architecture/architecture">
          Infrastructure <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Tool />
          <h4>Tools</h4>
        </div>
        <p>Use provided tools such as the CLI and REST API for simplified workflows</p>
        <Link to="developer-tools/overview">
          Tools <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Scroll />
          <h4>Smart Contract Language</h4>
        </div>
        <p>Read about Marlowe as a language to provide powerful abstractions to build faster</p>
        <Link to="platform-and-architecture/dsl">
          Smart contract language <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Brain />
          <h4>Playground</h4>
        </div>
        <p>Explore how to write smart contracts directly in a browser</p>
        <Link to="https://play.marlowe.iohk.io/">
          Playground <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
        <Cube />
          <h4>Blockly</h4>
        </div>
        <p>Visually design smart contracts with a drag and drop interface</p>
        <Link to="https://play.marlowe.iohk.io/#/blockly">
          Blockly <ArrowRight className="arrow" />
        </Link>
      </div>
      {/*
      <div className={styles.card}>
        <div className="card-header">
          <Book />
          <h4>API Reference</h4>
        </div>
        <p>Learn how to work with Marlowe on a lower level through the command line</p>
        <Link to="/api/get-contracts">
          API reference <ArrowRight className="arrow" />
        </Link>
      </div>
      */}
    </div>
  );
}

export default Topics;
