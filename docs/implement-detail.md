# 类型体操之实现一个类C风格语言的解释器

TypeScript 是 JavaScript 的超集，她主要给 JavaScript 添加了静态类型检查，并且与之完全兼容。在运行时，类型完全擦除。正因为如此，TypeScript 类型系统极其强大，这样才能维持 JavaScript 动态性，做快速开发的同时，做到更多的类型提示与错误检查。

> 下面为了简单，将用 ts、js 这样的简称代替 TypeScript、JavaScript。

动态性与静态检查似乎是冲突的？但是 ts 团队和社区给出了要兼顾两者的一条路。就是在 ts 编译器无法做出推断时，让开发者告诉 ts 如何推断。告诉 ts 的这段类型描述（简单说，就是随着输入类型不同，输出类型应该是什么），和对应 js 代码逻辑是一致的（因为只考虑类型，往往会简单一些）。所以 ts 的类型系统，要强大到[图灵完备](https://github.com/microsoft/TypeScript/issues/14833)才能胜任。

ts 的类型系统是一门函数式编程语言。类型体操说的就是利用这门编程语言玩花样。我们今天要玩的就是，用它实现另一门语言（这门语言我取名叫[toc](https://github.com/huanguolin/toc)）的解释器(如果要体验这个解释器请到[toc](https://github.com/huanguolin/toc)仓库, 很容易找到入口😊)。但是我不是立即开始，我们先要热热身。所以，本文主要分为两个部分：
1. ts 的类型系统是怎样的函数式语言？
2. 如何实现 toc 解释器？

如果第一部分对你没有什么新奇的，可以直接跳到第二部分。

# 1. ts 的类型系统是怎样的函数式语言？
说到编程语言，我们会想到至少要包含变量、条件、循环、函数这些特性，否则没法用（当然我说的是正常的编程语言，可不是像 [Ook!](https://code.tutsplus.com/articles/10-most-bizarre-programming-languages-ever-created--net-2412) 这种）。不过在我谈变量、条件、循环、函数这些之前，我要说点更基础的东西。

## 1.1 类型与值

类型是描述值的集合，比如 `number` 代表了所有数字。`1` 是 `number` 的一个值。但 `1` 也可以是一个类型，它描述的集合种只有一个值罢了。ts 允许我们做这种精确类型描述。所以她还提供了联合类型（[union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)）, 元组([tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types))等。
```ts
type A = 1;

// union
type B = 'red' | 'green' | 'blue';

// tuple
type C = [B, number];
```
当然她也提供了全集和空集：`any` 和 `never`。
下面我们回归变量、条件、循环、函数吧。


## 1.2 变量
实际上 ts 的类型系统并没有提供变量，她只提供了常量，这很函数式。不过这就够用了，如果你熟悉其他函数式编程语言，你就知道了。
```ts
type A = 2;
type B = string | A; // string | 2
```
这就是全部吗？其实还有一种是局部常量，这个等说条件的时候讲。另外讲函数时，入参也是一种常量😼。

## 1.3 条件
```ts
type A = 2;
type B = A extends number ? true : false; // true
```
是不是很简单？

`A extends B ? C : D` 这个形式，表达的是 `A` 可以赋值给 `B`，则结果是 `C`，否则为 `D`。可赋值在 ts 中是个关键的东西。

### 1.3.1 可赋值性
ts 采用的是结构型类型系统（[Structural Type System](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system), 也被称之为[鸭子类型](https://en.wikipedia.org/wiki/Duck_typing)）。就是说，ts 认为你是什么类型是看你有什么东西，结构是不是符合某个类型定义的结构。只要符合某个类型定义的结构就可以，所以不必像 `java` 或者 `c#` 那样必须在定义是说什么类型才可以。
```ts
type Cat = {
    eat: (food: string) => void;
};
type HuntDog = {
    eat: (food: string) => void;
    hunt: () => string;
};

type IsCat = HuntDog extends Cat ? true : false; // true

let cat: Cat = {
    eat: (food: string) => console.log(`eat ${food}`)
};
let hDog = {
    eat: (food: string) => console.log(`eat ${food}`),
    hunt: () => 'animal',
};

let hDog2: HuntDog = hDog; // ok
cat = hDog; // ok
hDog2 = cat; // error: Property 'hunt' is missing in type 'Cat' but required in type 'HuntDog'
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAwghsKBeKBvAsAKCjqEEBcUAFAGYD25AJkQM7ABOAlgHYDmAlMgHxQBu5JlQDcWAL6jMoSFAASAVxbAAIuTbI0WXHkIkK1Oo1ace-QSK24AFouBFiXJL3rN2kiVizToASVrxEFAUlVXUIAA9gCBYqWlgEKAB+KEZ5aCJSOAAbWghhKAB6ApSGNM9MLIhEAGNdAI0MbFx8Oz1KGigXY0deavIWWnJKgDostWIAAxaoABJUfSoxCY5xSUrEK1CGyxwW+wXDVxMnKD6BoYhR8amEuYWljgAaHagbJXseqAByOBYmAFtsl9npgPJgsOtXqEAExEYIqNQaTZqfJFKDkADWWFqgShKMKxUxWGRbGhGhxqOKEAYDHIDCAA)，在线体验。

回到 `A extends B ? C : D` ，只要 A 符合 B 的定义，或者说 A 类型是 B 类型的子集（当然，任何集合都是自身的子集），条件就成立，否则为不成立。这种形式下，还有一种可看作是模式匹配的语法。

### 1.3.2 模式匹配
```ts
type A = Promise<string>;
type B = A extends Promise<infer C> ? C : never; // string

type T = [string, 1, null, A];
type R = T extends [string, ...infer Rest] ? Rest : never; // [1, null, A]
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UAKAnA9gWwJYGcIB4dgUsA7AcwD4BuAWAChRIoAhBWKCAD2AlIBMcydNjz4yAMwgooAYUpQA-HKgAuKKQgA3adSgB6fVCIkKDBk2gAVdgG0TZcgBooARhekArgBtvLmAC6dIzg0ABK7DbcvAJC9sSOLgB0KZLSUGEQRAFKGVnAahraugZGtu4aPn6wAUA)，在线体验。

这种语法可以识别，`extends` 左边是不是符合右边的类型结构，如果符合，可以推断出其中的某个部分。

### 1.3.3 局部常量
上面例子种的 `C` 和 `Rest` 就是局部常量。利用这个我可以随时在局部换个变量名字：
```ts
type T = [string, 1, null, undefined];
type R = T extends [string, ...infer Rest]
    ? Rest extends [1, ...infer Rest]
        ? Rest extends [null, infer Rest] // 旧名字，但是在新的作用域
            ? Rest extends infer Last // 换名字，无聊🥱，别担心，后面会用上的
                ? Last
                : never
            : never
        : never
    : never;
// undefined
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKlC8UDaBnYAnAlgOwOYBooBGQ7AVwBsLCzsATCAMxwjoF0BuAWAChRIoAJQSwoEAB7AI9FMjRY8hAHQqcjCOiEQ0bXlH1QA-FrRjJ0urKQkoKpWo0ngungbdGnZqTOTkqhB01BbWc9d3DjYNMJb0soQKgAGQBDNDDwjI8UtNdMjIAuKGwIADcNdLzC4rL0Crcq0vLc-Qaa7h4Aeg6oWgZmYrogA)，在线体验。

在 [4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#extends-constraints-on-infer-type-variables), [4.8](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#infer-types-template-strings) 两个版本还对这个条件表达式有优化，后续会将到。


### 1.4 函数
不该讲循环了吗？额...其实 ts 类型系统中没有循环😓。不过别急，有替代品。我想你知道的，没错！就是递归。所以要先看下函数。