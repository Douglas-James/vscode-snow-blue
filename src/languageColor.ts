export interface LanguageColors {
  [language: string]: TokenColorRule[];
}

export interface TokenColorRule {
  name: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    fontStyle?: string;
    background?: string;
  };
}

export const languageColors: LanguageColors = {
  css: [
    {
      name: "CSS Property Name",
      scope: ["support.type.property-name.css"],
      settings: {
        foreground: "#4da6ff",
      },
    },
    {
      name: "CSS Property Value",
      scope: ["support.constant.property-value.css"],
      settings: {
        foreground: "#22c55e",
      },
    },
    {
      name: "CSS Class Selector",
      scope: ["entity.other.attribute-name.class.css"],
      settings: {
        foreground: "#fbbf24",
        fontStyle: "italic",
      },
    },
    {
      name: "CSS ID Selector",
      scope: ["entity.other.attribute-name.id.css"],
      settings: {
        foreground: "#ec4899",
        fontStyle: "italic",
      },
    },
    {
      name: "CSS Tag Selector",
      scope: ["entity.name.tag.css"],
      settings: {
        foreground: "#f87171",
      },
    },
    {
      name: "CSS Units",
      scope: ["keyword.other.unit.css"],
      settings: {
        foreground: "#a78bfa",
      },
    },
    {
      name: "CSS Colors",
      scope: ["constant.other.color.rgb-value.css"],
      settings: {
        foreground: "#06b6d4",
      },
    },
    {
      name: "CSS Pseudo-selector",
      scope: ["entity.other.attribute-name.pseudo-class.css"],
      settings: {
        foreground: "#fbbf24",
        fontStyle: "italic",
      },
    },
  ],

  javascript: [
    {
      name: "JS Function Declaration",
      scope: ["entity.name.function.js"],
      settings: {
        foreground: "#60a5fa",
        fontStyle: "bold",
      },
    },
    {
      name: "JS Function Call",
      scope: ["entity.name.function.js"],
      settings: {
        foreground: "#60a5fa",
      },
    },
    {
      name: "JS Property",
      scope: ["support.variable.property.js", "variable.other.property.js"],
      settings: {
        foreground: "#a1d5e8",
      },
    },
    {
      name: "JS Object Property",
      scope: ["meta.object-literal.key.js"],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      name: "JS Keyword",
      scope: ["keyword.control.js"],
      settings: {
        foreground: "#f472b6",
        fontStyle: "bold",
      },
    },
    {
      name: "JS String",
      scope: ["string.quoted.single.js", "string.quoted.double.js"],
      settings: {
        foreground: "#22c55e",
      },
    },
    {
      name: "JS Number",
      scope: ["constant.numeric.js"],
      settings: {
        foreground: "#fb923c",
      },
    },
    {
      name: "JS Boolean",
      scope: ["constant.language.boolean.js"],
      settings: {
        foreground: "#f87171",
        fontStyle: "bold",
      },
    },
    {
      name: "JS Variable",
      scope: ["variable.other.js"],
      settings: {
        foreground: "#e0e0e0",
      },
    },
    {
      name: "JS Arrow Function",
      scope: ["punctuation.definition.parameters.js"],
      settings: {
        foreground: "#f472b6",
      },
    },
    {
      name: "JS Template String",
      scope: ["string.template.js"],
      settings: {
        foreground: "#22c55e",
      },
    },
    {
      name: "JS Template Substitution",
      scope: ["meta.template.expression.js"],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      name: "JS Comment",
      scope: ["comment.line.double-slash.js", "comment.block.js"],
      settings: {
        foreground: "#6b7280",
        fontStyle: "italic",
      },
    },
  ],

  html: [
    {
      name: "HTML Tag",
      scope: ["entity.name.tag.html"],
      settings: {
        foreground: "#f87171",
        fontStyle: "bold",
      },
    },
    {
      name: "HTML Tag Punctuation",
      scope: ["punctuation.definition.tag.html"],
      settings: {
        foreground: "#f87171",
      },
    },
    {
      name: "HTML Attribute Name",
      scope: ["entity.other.attribute-name.html"],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      name: "HTML Attribute Value",
      scope: ["string.quoted.double.html"],
      settings: {
        foreground: "#22c55e",
      },
    },
    {
      name: "HTML Entity",
      scope: ["constant.character.entity.html"],
      settings: {
        foreground: "#06b6d4",
      },
    },
    {
      name: "HTML Self-Closing Tag",
      scope: ["punctuation.definition.tag.self-closing.html"],
      settings: {
        foreground: "#f87171",
      },
    },
    {
      name: "HTML Comment",
      scope: ["comment.block.html"],
      settings: {
        foreground: "#6b7280",
        fontStyle: "italic",
      },
    },
  ],

  python: [
    {
      name: "Python Function Definition",
      scope: ["entity.name.function.python"],
      settings: {
        foreground: "#60a5fa",
        fontStyle: "bold",
      },
    },
    {
      name: "Python Class Definition",
      scope: ["entity.name.class.python"],
      settings: {
        foreground: "#c084fc",
        fontStyle: "bold",
      },
    },
    {
      name: "Python Keyword",
      scope: ["keyword.control.flow.python"],
      settings: {
        foreground: "#f472b6",
        fontStyle: "bold",
      },
    },
    {
      name: "Python String",
      scope: [
        "string.quoted.single.python",
        "string.quoted.double.python",
        "string.quoted.triple.python",
      ],
      settings: {
        foreground: "#22c55e",
      },
    },
    {
      name: "Python Number",
      scope: ["constant.numeric.python"],
      settings: {
        foreground: "#fb923c",
      },
    },
    {
      name: "Python Boolean",
      scope: ["constant.language.python"],
      settings: {
        foreground: "#f87171",
        fontStyle: "bold",
      },
    },
    {
      name: "Python Built-in Function",
      scope: ["support.function.builtin.python"],
      settings: {
        foreground: "#a1d5e8",
        fontStyle: "italic",
      },
    },
    {
      name: "Python Property",
      scope: [
        "support.other.property.python",
        "variable.other.property.python",
      ],
      settings: {
        foreground: "#a1d5e8",
      },
    },
    {
      name: "Python Decorator",
      scope: ["meta.function.decorator.python"],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      name: "Python Comment",
      scope: ["comment.line.number-sign.python"],
      settings: {
        foreground: "#6b7280",
        fontStyle: "italic",
      },
    },
    {
      name: "Python Self",
      scope: ["variable.language.magic.python"],
      settings: {
        foreground: "#f472b6",
        fontStyle: "bold",
      },
    },
    {
      name: "Python Variable",
      scope: ["variable.other.python"],
      settings: {
        foreground: "#e0e0e0",
      },
    },
  ],
};

export function getLanguageColorRules(language: string): TokenColorRule[] {
  return languageColors[language] || [];
}

export function getAllLanguageColorRules(): TokenColorRule[] {
  return Object.values(languageColors).flat();
}

export function generateTokenColors(): any[] {
  return getAllLanguageColorRules().map((rule) => ({
    name: rule.name,
    scope: rule.scope,
    settings: rule.settings,
  }));
}
