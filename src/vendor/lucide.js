/*! Lokalna kopia Lucide. Odświeżanie: npm run icons:update
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
//#region node_modules/lucide/dist/esm/defaultAttributes.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/lucide/dist/esm/createElement.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createSVGElement = ([tag, attrs, children]) => {
	const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
	Object.keys(attrs).forEach((name) => {
		element.setAttribute(name, String(attrs[name]));
	});
	if (children?.length) children.forEach((child) => {
		const childElement = createSVGElement(child);
		element.appendChild(childElement);
	});
	return element;
};
var createElement = (iconNode, customAttrs = {}) => {
	return createSVGElement([
		"svg",
		{
			...defaultAttributes,
			...customAttrs
		},
		iconNode
	]);
};
//#endregion
//#region node_modules/lucide/dist/esm/shared/src/utils/mergeClasses.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/lucide/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/lucide/dist/esm/shared/src/utils/toCamelCase.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => {
	let out = "";
	let upperNext = false;
	for (const ch of string) {
		if (ch === "-" || ch === "_" || ch <= " ") {
			upperNext = out.length > 0;
			continue;
		}
		if (out.length === 0) out += ch.toLowerCase();
		else out += upperNext ? ch.toUpperCase() : ch;
		upperNext = false;
	}
	return out;
};
//#endregion
//#region node_modules/lucide/dist/esm/shared/src/utils/toPascalCase.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/lucide/dist/esm/replaceElement.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var getAttrs = (element) => Array.from(element.attributes).reduce((attrs, attr) => {
	attrs[attr.name] = attr.value;
	return attrs;
}, {});
var getClassNames = (attrs) => {
	if (typeof attrs === "string") return attrs;
	if (!attrs || !attrs.class) return "";
	if (attrs.class && typeof attrs.class === "string") return attrs.class.split(" ");
	if (attrs.class && Array.isArray(attrs.class)) return attrs.class;
	return "";
};
var replaceElement = (element, { nameAttr, icons, attrs }) => {
	const iconName = element.getAttribute(nameAttr);
	if (iconName == null) return;
	const iconNode = icons[toPascalCase(iconName)];
	if (!iconNode) return console.warn(`${element.outerHTML} icon name was not found in the provided icons object.`);
	const elementAttrs = getAttrs(element);
	const ariaProps = hasA11yProp(elementAttrs) ? {} : { "aria-hidden": "true" };
	const iconAttrs = {
		...defaultAttributes,
		"data-lucide": iconName,
		...ariaProps,
		...attrs,
		...elementAttrs
	};
	const elementClassNames = getClassNames(elementAttrs);
	const className = getClassNames(attrs);
	const classNames = mergeClasses("lucide", `lucide-${iconName}`, ...elementClassNames, ...className);
	if (classNames) Object.assign(iconAttrs, { class: classNames });
	const svgElement = createElement(iconNode, iconAttrs);
	return element.parentNode?.replaceChild(svgElement, element);
};
//#endregion
//#region node_modules/lucide/dist/esm/icons/arrow-down.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowDown = [["path", { d: "M12 5v14" }], ["path", { d: "m19 12-7 7-7-7" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/arrow-up.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUp = [["path", { d: "m5 12 7-7 7 7" }], ["path", { d: "M12 19V5" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/check.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = [["path", { d: "M20 6 9 17l-5-5" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/chevron-down.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronDown = [["path", { d: "m6 9 6 6 6-6" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/circle.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Circle = [["circle", {
	cx: "12",
	cy: "12",
	r: "10"
}]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/download.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Download = [
	["path", { d: "M12 15V3" }],
	["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
	["path", { d: "m7 10 5 5 5-5" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/ear.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ear = [["path", { d: "M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" }], ["path", { d: "M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/eraser.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Eraser = [["path", { d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" }], ["path", { d: "m5.082 11.09 8.828 8.828" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/eye.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Eye = [["path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
	cx: "12",
	cy: "12",
	r: "3"
}]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/eye-off.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var EyeOff = [
	["path", { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }],
	["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
	["path", { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }],
	["path", { d: "m2 2 20 20" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/file-braces.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FileBraces = [
	["path", { d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
	["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
	["path", { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" }],
	["path", { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/folder-open.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FolderOpen = [["path", { d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/hourglass.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Hourglass = [
	["path", { d: "M5 22h14" }],
	["path", { d: "M5 2h14" }],
	["path", { d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" }],
	["path", { d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/image-down.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ImageDown = [
	["path", { d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" }],
	["path", { d: "m14 19 3 3v-5.5" }],
	["path", { d: "m17 22 3-3" }],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2"
	}]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/layers.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Layers = [
	["path", { d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" }],
	["path", { d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" }],
	["path", { d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/minus.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Minus = [["path", { d: "M5 12h14" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/moon.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Moon = [["path", { d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/mouse-pointer-2.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MousePointer2 = [["path", { d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/paint-bucket.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PaintBucket = [
	["path", { d: "M11 7 6 2" }],
	["path", { d: "M18.992 12H2.041" }],
	["path", { d: "M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595" }],
	["path", { d: "m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/palette.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Palette = [
	["path", { d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" }],
	["circle", {
		cx: "13.5",
		cy: "6.5",
		r: ".5",
		fill: "currentColor"
	}],
	["circle", {
		cx: "17.5",
		cy: "10.5",
		r: ".5",
		fill: "currentColor"
	}],
	["circle", {
		cx: "6.5",
		cy: "12.5",
		r: ".5",
		fill: "currentColor"
	}],
	["circle", {
		cx: "8.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor"
	}]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/paintbrush.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Paintbrush = [
	["path", { d: "m14.622 17.897-10.68-2.913" }],
	["path", { d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" }],
	["path", { d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/paw-print.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PawPrint = [
	["circle", {
		cx: "11",
		cy: "4",
		r: "2"
	}],
	["circle", {
		cx: "18",
		cy: "8",
		r: "2"
	}],
	["circle", {
		cx: "20",
		cy: "16",
		r: "2"
	}],
	["path", { d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/pencil.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pencil = [["path", { d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { d: "m15 5 4 4" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/plus.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = [["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/redo-2.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Redo2 = [["path", { d: "m15 14 5-5-5-5" }], ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/sparkles.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sparkles = [
	["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }],
	["path", { d: "M20 2v4" }],
	["path", { d: "M22 4h-4" }],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2"
	}]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/spray-can.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SprayCan = [
	["path", { d: "M3 3h.01" }],
	["path", { d: "M7 5h.01" }],
	["path", { d: "M11 7h.01" }],
	["path", { d: "M3 7h.01" }],
	["path", { d: "M7 9h.01" }],
	["path", { d: "M3 11h.01" }],
	["rect", {
		width: "4",
		height: "4",
		x: "15",
		y: "5"
	}],
	["path", { d: "m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" }],
	["path", { d: "m13 14 8-2" }],
	["path", { d: "m13 19 8-2" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/square.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Square = [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2"
}]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/squirrel.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Squirrel = [
	["path", { d: "M15.236 22a3 3 0 0 0-2.2-5" }],
	["path", { d: "M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4" }],
	["path", { d: "M18 13h.01" }],
	["path", { d: "M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/sun.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sun = [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}],
	["path", { d: "M12 2v2" }],
	["path", { d: "M12 20v2" }],
	["path", { d: "m4.93 4.93 1.41 1.41" }],
	["path", { d: "m17.66 17.66 1.41 1.41" }],
	["path", { d: "M2 12h2" }],
	["path", { d: "M20 12h2" }],
	["path", { d: "m6.34 17.66-1.41 1.41" }],
	["path", { d: "m19.07 4.93-1.41 1.41" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/trash.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trash = [
	["path", { d: "M10 11v6" }],
	["path", { d: "M14 11v6" }],
	["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
	["path", { d: "M3 6h18" }],
	["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/type.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Type = [
	["path", { d: "M12 4v16" }],
	["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
	["path", { d: "M9 20h6" }]
];
//#endregion
//#region node_modules/lucide/dist/esm/icons/undo-2.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Undo2 = [["path", { d: "M9 14 4 9l5-5" }], ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" }]];
//#endregion
//#region node_modules/lucide/dist/esm/icons/x.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = [["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]];
//#endregion
//#region node_modules/lucide/dist/esm/lucide.mjs
/**
* @license lucide v1.47.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createIcons = ({ icons = {}, nameAttr = "data-lucide", attrs = {}, root = document, inTemplates } = {}) => {
	if (!Object.values(icons).length) throw new Error("Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`");
	if (typeof root === "undefined") throw new Error("`createIcons()` only works in a browser environment.");
	Array.from(root.querySelectorAll(`[${nameAttr}]`)).forEach((element) => replaceElement(element, {
		nameAttr,
		icons,
		attrs
	}));
	if (inTemplates) Array.from(root.querySelectorAll("template")).forEach((template) => createIcons({
		icons,
		nameAttr,
		attrs,
		root: template.content,
		inTemplates
	}));
	if (nameAttr === "data-lucide") {
		const deprecatedElements = root.querySelectorAll("[icon-name]");
		if (deprecatedElements.length > 0) {
			console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide");
			Array.from(deprecatedElements).forEach((element) => replaceElement(element, {
				nameAttr: "icon-name",
				icons,
				attrs
			}));
		}
	}
};
//#endregion
export { ArrowDown, ArrowUp, Check, ChevronDown, Circle, Download, Ear, Eraser, Eye, EyeOff, FileBraces as FileJson, FolderOpen, Hourglass, ImageDown, Layers, Minus, Moon, MousePointer2, PaintBucket, Paintbrush, Palette, PawPrint, Pencil, Plus, Redo2, Sparkles, SprayCan, Square, Squirrel, Sun, Trash as Trash2, Type, Undo2, X, createIcons };
