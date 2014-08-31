# is <sup>[![Version Badge][2]][1]</sup>

[![Build Status][3]][4] [![dependency status][5]][6] [![dev dependency status][7]][8]

[![npm badge][11]][1]

[![browser support][9]][10]

The definitive JavaScript type testing library

To be or not to be? This is the library!

## Installation

As a node.js module

```shell
$ npm install is
```

As a component
```shell
$ component install enricomarino/is
```

## API

### general

 - ``is.a`` (value, type) or ``is.type`` (value, type)
 - ``is.defined`` (value)
 - ``is.empty`` (value)
 - ``is.equal`` (value, other)
 - ``is.hosted`` (value, host)
 - ``is.instance`` (value, constructor)
 - ``is.instanceof`` (value, constructor) - deprecated, because in ES3 browsers, "instanceof" is a reserved word
 - ``is.nil`` (value)
 - ``is.null`` (value) - deprecated, because in ES3 browsers, "null" is a reserved word
 - ``is.undef`` (value)
 - ``is.undefined`` (value) - deprecated, because in ES3 browsers, "undefined" is a reserved word

### arguments

 - ``is.args`` (value)
 - ``is.arguments`` (value) - deprecated, because "arguments" is a reserved word
 - ``is.args.empty`` (value)

### array

 - ``is.array`` (value)
 - ``is.array.empty`` (value)
 - ``is.arraylike`` (value)

### boolean

 - ``is.boolean`` (value)
 - ``is.false`` (value) - deprecated, because in ES3 browsers, "false" is a reserved word
 - ``is.true`` (value) - deprecated, because in ES3 browsers, "true" is a reserved word

### date

 - ``is.date`` (value)

### element

 - ``is.element`` (value)

### error

 - is.error (value)

### function

 - ``is.fn`` (value)
 - ``is.function`` (value) - deprecated, because in ES3 browsers, "function" is a reserved word

### number

 - ``is.number`` (value)
 - ``is.infinite`` (value)
 - ``is.decimal`` (value)
 - ``is.divisibleBy`` (value, n)
 - ``is.int`` (value)
 - ``is.maximum`` (value, others)
 - ``is.minimum`` (value, others)
 - ``is.nan`` (value)
 - ``is.even`` (value)
 - ``is.odd`` (value)
 - ``is.ge`` (value, other)
 - ``is.gt`` (value, other)
 - ``is.le`` (value, other)
 - ``is.lt`` (value, other)
 - ``is.within`` (value, start, finish)

### object

 - ``is.object`` (value)

### regexp

 - ``is.regexp`` (value)

### string

 - ``is.string`` (value)


## Contributors

- [Jordan Harband](https://github.com/ljharb)

[1]: https://npmjs.org/package/is
[2]: http://vb.teelaun.ch/enricomarino/is.svg
[3]: https://travis-ci.org/enricomarino/is.svg
[4]: https://travis-ci.org/enricomarino/is
[5]: https://david-dm.org/enricomarino/is.svg
[6]: https://david-dm.org/enricomarino/is
[7]: https://david-dm.org/enricomarino/is/dev-status.svg
[8]: https://david-dm.org/enricomarino/is#info=devDependencies
[9]: https://ci.testling.com/enricomarino/is.png
[10]: https://ci.testling.com/enricomarino/is
[11]: https://nodei.co/npm/is.png?downloads=true&stars=true

