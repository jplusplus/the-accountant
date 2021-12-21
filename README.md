# The Good, The Bad and The Accountant

[![Code Climate](https://codeclimate.com/github/jplusplus/the-accountant/badges/gpa.svg)](https://codeclimate.com/github/jplusplus/the-accountant)
[![Build Status](https://travis-ci.org/jplusplus/the-accountant.svg?branch=master)](https://travis-ci.org/jplusplus/the-accountant)
[![Coverage Status](https://coveralls.io/repos/github/jplusplus/the-accountant/badge.svg?branch=master)](https://coveralls.io/github/jplusplus/the-accountant?branch=master)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](http://www.gnu.org/licenses/lgpl-3.0)

_The Good, The Bad and The Accountant_ aims at teaching journalists and their audience about the intricacies of corruption in local budgets. It is the interactive counterpart to [Cooking Budgets](http://cookingbudgets.com/), a series of tutorials on how corruption works in Europe.

The choices you have to make in _The Good, The Bad and The Accountant_ can involve active or passive corruption. This does not mean that all civil servants are corrupt. But it does mean that corruption is a systemic issue. Anyone working near large contracts, public or private, has dealt or will deal with officials using their position to serve a third party. As we show in the tool, dealing with corruption cannot mean to simply refuse it. Refusing it might lead to conflicts with other stakeholders.

See [the about](src/markdowns/about/en.md) for details. (Also available in [German](src/markdowns/about/de.md), [French](src/markdowns/about/fr.md) and [Slovak](src/markdowns/about/sl.md).)

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 6.9.x, npm >= 2.x.x (or Yarn)

### Developing

1. Run `make install` to install server dependencies.
1. Run `make run` to start the development server.

## Deploy

To deploy on Github Pages run `make deploy`.

## Test

To run unit tests use `make test`.


## Embed

**In english:**

```
<iframe  width="100%" height="700" src="//jplusplus.github.io/the-accountant/" frameborder="0" allowfullscreen></iframe>
```

**In french:**

```
<iframe  width="100%" height="700" src="//jplusplus.github.io/the-accountant/fr.html" frameborder="0" allowfullscreen></iframe>
```
