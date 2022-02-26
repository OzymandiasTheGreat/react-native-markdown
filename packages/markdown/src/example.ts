const image =
	"https://storage.googleapis.com/gweb-uniblog-publish-prod/images/StillForKeyword_1.max-600x600.png";

export const text = `
# Markdown Example

## Basic

This is a paragraph. It's a variable length block of text that may or may not
contain additional formatting. For example *this text is italic*. There's also
**bold** and ~~striketrough~~.

A paragraph may also contain [links](https://google.com) and/or images
![Image](${image})
Determining wether an image appears inline is beyond me, but it mostly depends
on size.

Links and images may also be defined elsewhere in the document and refered to
as [such][Google].

It is also possible to define footnotes. They appear at the end of the document. [^fn]

[Google]: https://google.com/
[^fn]: This is not supported on mobile

---

> This is quoted text. It may also contain subquotes:
>> Fear is the path to the Dark Side...
> Otherwise it behaves mostly as a paragraph

- This is a list
- It may be ordered or not
- It can also contain sublists
	1. Like this
	2. Or this

---

There also codeblocks:

\`\`\`typescript
export function multiply(a: number, b: number): number {
	return a * b;
}
\`\`\`

Code block are \`syntax-highlighted\`.
That was inline code just now. Inline code is not \`syntax-highlighted\`.

---

<p>
This is inline HTML. Visually it is no different from the rest of the document,
but it allows to use the full power of HTML markup inside Markdown documents.
It is not fully supported everywhere though.
</p>

---

Last, but not least, there are tables.

They | appear | as such
-----|--------|---------
I have | not | decided
How | to properly | deal
with | tables | yet

`;
