import { type ThemeRegistration } from 'shiki'

export const lightTheme: ThemeRegistration = {
	name: 'wking-light',
	colors: {
		'editor.background': '#f3f4f6',
		'editor.foreground': '#09090B',
		'editor.hoverHighlightBackground': '#8BE9FD50',
		'editor.lineHighlightBorder': '#44475A',
		'editor.rangeHighlightBackground': '#BD93F915',
		'editor.selectionBackground': '#44475A',
		'editor.selectionHighlightBackground': '#424450',
		'editor.snippetFinalTabstopHighlightBackground': '#f3f4f6',
		'editor.snippetFinalTabstopHighlightBorder': '#35C097',
		'editor.snippetTabstopHighlightBackground': '#f3f4f6',
		'editor.snippetTabstopHighlightBorder': '#9ca3af',
		'editor.wordHighlightBackground': '#8BE9FD50',
		'editor.wordHighlightStrongBackground': '#50FA7B50',
		'editorBracketHighlight.foreground1': '#09090B',
		'editorBracketHighlight.foreground2': '#FF75DD',
		'editorBracketHighlight.foreground3': '#3177F6',
		'editorBracketHighlight.foreground4': '#35C097',
		'editorBracketHighlight.foreground5': '#7561FA',
		'editorBracketHighlight.foreground6': '#F28D45',
		'editorBracketHighlight.unexpectedBracket.foreground': '#ee6666',
		'editorCodeLens.foreground': '#9ca3af',
		'editorError.foreground': '#ee6666',
		'editorGroup.border': '#7561FA',
		'editorGroup.dropBackground': '#44475A70',
		'editorGroupHeader.tabsBackground': '#191A21',
		'editorGutter.addedBackground': '#50FA7B80',
		'editorGutter.deletedBackground': '#FF555580',
		'editorGutter.modifiedBackground': '#8BE9FD80',
		'editorHoverWidget.background': '#f3f4f6',
		'editorHoverWidget.border': '#9ca3af',
		'editorIndentGuide.activeBackground': '#FFFFFF45',
		'editorIndentGuide.background': '#FFFFFF1A',
		'editorLineNumber.foreground': '#9ca3af',
		'editorLink.activeForeground': '#3177F6',
		'editorMarkerNavigation.background': '#262626',
		'editorOverviewRuler.addedForeground': '#50FA7B80',
		'editorOverviewRuler.border': '#191A21',
		'editorOverviewRuler.currentContentForeground': '#35C097',
		'editorOverviewRuler.deletedForeground': '#FF555580',
		'editorOverviewRuler.errorForeground': '#FF555580',
		'editorOverviewRuler.incomingContentForeground': '#7561FA',
		'editorOverviewRuler.infoForeground': '#8BE9FD80',
		'editorOverviewRuler.modifiedForeground': '#8BE9FD80',
		'editorOverviewRuler.selectionHighlightForeground': '#F28D45',
		'editorOverviewRuler.warningForeground': '#F28D4580',
		'editorOverviewRuler.wordHighlightForeground': '#3177F6',
		'editorOverviewRuler.wordHighlightStrongForeground': '#35C097',
		'editorRuler.foreground': '#FFFFFF1A',
		'editorSuggestWidget.background': '#262626',
		'editorSuggestWidget.foreground': '#09090B',
		'editorSuggestWidget.selectedBackground': '#44475A',
		'editorWarning.foreground': '#3177F6',
		'editorWhitespace.foreground': '#FFFFFF1A',
		'editorWidget.background': '#262626',
		errorForeground: '#ee6666',
		'extensionButton.prominentBackground': '#50FA7B90',
		'extensionButton.prominentForeground': '#09090B',
		'extensionButton.prominentHoverBackground': '#50FA7B60',
		focusBorder: '#9ca3af',
		foreground: '#09090B',
		'gitDecoration.conflictingResourceForeground': '#F28D45',
		'gitDecoration.deletedResourceForeground': '#ee6666',
		'gitDecoration.ignoredResourceForeground': '#9ca3af',
		'gitDecoration.modifiedResourceForeground': '#3177F6',
		'gitDecoration.untrackedResourceForeground': '#35C097',
		'inlineChat.regionHighlight': '#343746',
		'input.background': '#f3f4f6',
		'input.border': '#191A21',
		'input.foreground': '#09090B',
		'input.placeholderForeground': '#9ca3af',
		'inputOption.activeBorder': '#7561FA',
		'inputValidation.errorBorder': '#ee6666',
		'inputValidation.infoBorder': '#FF75DD',
		'inputValidation.warningBorder': '#F28D45',
		'list.activeSelectionBackground': '#44475A',
		'list.activeSelectionForeground': '#09090B',
		'list.dropBackground': '#44475A',
		'list.errorForeground': '#ee6666',
		'list.focusBackground': '#44475A75',
		'list.highlightForeground': '#3177F6',
		'list.hoverBackground': '#44475A75',
		'list.inactiveSelectionBackground': '#44475A75',
		'list.warningForeground': '#F28D45',
		'listFilterWidget.background': '#343746',
		'listFilterWidget.noMatchesOutline': '#ee6666',
		'listFilterWidget.outline': '#424450',
		'merge.currentHeaderBackground': '#50FA7B90',
		'merge.incomingHeaderBackground': '#BD93F990',
		'panel.background': '#f3f4f6',
		'panel.border': '#7561FA',
		'panelTitle.activeBorder': '#FF75DD',
		'panelTitle.activeForeground': '#09090B',
		'panelTitle.inactiveForeground': '#9ca3af',
		'peekView.border': '#44475A',
		'peekViewEditor.background': '#f3f4f6',
		'peekViewEditor.matchHighlightBackground': '#F1FA8C80',
		'peekViewResult.background': '#262626',
		'peekViewResult.fileForeground': '#09090B',
		'peekViewResult.lineForeground': '#09090B',
		'peekViewResult.matchHighlightBackground': '#F1FA8C80',
		'peekViewResult.selectionBackground': '#44475A',
		'peekViewResult.selectionForeground': '#09090B',
		'peekViewTitle.background': '#191A21',
		'peekViewTitleDescription.foreground': '#9ca3af',
		'peekViewTitleLabel.foreground': '#09090B',
		'pickerGroup.border': '#7561FA',
		'pickerGroup.foreground': '#3177F6',
		'progressBar.background': '#FF75DD',
		'selection.background': '#7561FA',
		'settings.checkboxBackground': '#262626',
		'settings.checkboxBorder': '#191A21',
		'settings.checkboxForeground': '#09090B',
		'settings.dropdownBackground': '#262626',
		'settings.dropdownBorder': '#191A21',
		'settings.dropdownForeground': '#09090B',
		'settings.headerForeground': '#09090B',
		'settings.modifiedItemIndicator': '#F28D45',
		'settings.numberInputBackground': '#262626',
		'settings.numberInputBorder': '#191A21',
		'settings.numberInputForeground': '#09090B',
		'settings.textInputBackground': '#262626',
		'settings.textInputBorder': '#191A21',
		'settings.textInputForeground': '#09090B',
		'sideBar.background': '#262626',
		'sideBarSectionHeader.background': '#f3f4f6',
		'sideBarSectionHeader.border': '#191A21',
		'sideBarTitle.foreground': '#09090B',
		'statusBar.background': '#191A21',
		'statusBar.debuggingBackground': '#ee6666',
		'statusBar.debuggingForeground': '#191A21',
		'statusBar.foreground': '#09090B',
		'statusBar.noFolderBackground': '#191A21',
		'statusBar.noFolderForeground': '#09090B',
		'statusBarItem.prominentBackground': '#ee6666',
		'statusBarItem.prominentHoverBackground': '#F28D45',
		'statusBarItem.remoteBackground': '#7561FA',
		'statusBarItem.remoteForeground': '#f3f4f6',
		'tab.activeBackground': '#f3f4f6',
		'tab.activeBorderTop': '#FF79C680',
		'tab.activeForeground': '#09090B',
		'tab.border': '#191A21',
		'tab.inactiveBackground': '#262626',
		'tab.inactiveForeground': '#9ca3af',
		'terminal.ansiBlack': '#262626',
		'terminal.ansiBlue': '#7561FA',
		'terminal.ansiBrightBlack': '#9ca3af',
		'terminal.ansiBrightBlue': '#d6b4f7',
		'terminal.ansiBrightCyan': '#adf6f6',
		'terminal.ansiBrightGreen': '#78f09a',
		'terminal.ansiBrightMagenta': '#f49dda',
		'terminal.ansiBrightRed': '#f07c7c',
		'terminal.ansiBrightWhite': '#ffffff',
		'terminal.ansiBrightYellow': '#f6f6ae',
		'terminal.ansiCyan': '#3177F6',
		'terminal.ansiGreen': '#35C097',
		'terminal.ansiMagenta': '#FF75DD',
		'terminal.ansiRed': '#ee6666',
		'terminal.ansiWhite': '#09090B',
		'terminal.ansiYellow': '#7ECC00',
		'terminal.background': '#f3f4f6',
		'terminal.foreground': '#09090B',
		'titleBar.activeBackground': '#262626',
		'titleBar.activeForeground': '#09090B',
		'titleBar.inactiveBackground': '#191A21',
		'titleBar.inactiveForeground': '#9ca3af',
		'walkThrough.embeddedEditorBackground': '#262626',
	},
	displayName: 'Craft Lab',
	semanticHighlighting: true,
	tokenColors: [
		{
			scope: ['emphasis'],
			settings: {
				fontStyle: 'italic',
			},
		},
		{
			scope: ['strong'],
			settings: {
				fontStyle: 'bold',
			},
		},
		{
			scope: ['header'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: ['meta.diff', 'meta.diff.header'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: ['markup.inserted'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['markup.deleted'],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['markup.changed'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['invalid'],
			settings: {
				fontStyle: 'underline italic',
				foreground: '#ee6666',
			},
		},
		{
			scope: ['invalid.deprecated'],
			settings: {
				fontStyle: 'underline italic',
				foreground: '#09090B',
			},
		},
		{
			scope: ['entity.name.filename'],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['markup.error'],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['markup.underline'],
			settings: {
				fontStyle: 'underline',
			},
		},
		{
			scope: ['markup.bold'],
			settings: {
				fontStyle: 'bold',
				foreground: '#F28D45',
			},
		},
		{
			scope: ['markup.heading'],
			settings: {
				fontStyle: 'bold',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['markup.italic'],
			settings: {
				fontStyle: 'italic',
				foreground: '#7ECC00',
			},
		},
		{
			scope: [
				'beginning.punctuation.definition.list.markdown',
				'beginning.punctuation.definition.quote.markdown',
				'punctuation.definition.link.restructuredtext',
			],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: ['markup.inline.raw', 'markup.raw.restructuredtext'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['markup.underline.link', 'markup.underline.link.image'],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'meta.link.reference.def.restructuredtext',
				'punctuation.definition.directive.restructuredtext',
				'string.other.link.description',
				'string.other.link.title',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.name.directive.restructuredtext', 'markup.quote'],
			settings: {
				fontStyle: 'italic',
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['meta.separator.markdown'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'fenced_code.block.language',
				'markup.raw.inner.restructuredtext',
				'markup.fenced_code.block.markdown punctuation.definition.markdown',
			],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['punctuation.definition.constant.restructuredtext'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'markup.heading.markdown punctuation.definition.string.begin',
				'markup.heading.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'meta.paragraph.markdown punctuation.definition.string.begin',
				'meta.paragraph.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: [
				'markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.begin',
				'markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['entity.name.type.class', 'entity.name.class'],
			settings: {
				fontStyle: 'normal',
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'keyword.expressions-and-types.swift',
				'keyword.other.this',
				'variable.language',
				'variable.language punctuation.definition.variable.php',
				'variable.other.readwrite.instance.ruby',
				'variable.parameter.function.language.special',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['entity.other.inherited-class'],
			settings: {
				fontStyle: 'italic',
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'comment',
				'punctuation.definition.comment',
				'unused.comment',
				'wildcard.comment',
			],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'comment keyword.codetag.notation',
				'comment.block.documentation keyword',
				'comment.block.documentation storage.type.class',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['comment.block.documentation entity.name.type'],
			settings: {
				fontStyle: 'italic',
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'comment.block.documentation entity.name.type punctuation.definition.bracket',
			],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: ['comment.block.documentation variable'],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: ['constant', 'variable.other.constant'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'constant.character.escape',
				'constant.character.string.escape',
				'constant.regexp',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.name.tag'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.other.attribute-name.parent-selector'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.other.attribute-name'],
			settings: {
				fontStyle: 'italic',
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'entity.name.function',
				'meta.function-call.object',
				'meta.function-call.php',
				'meta.function-call.static',
				'meta.method-call.java meta.method',
				'meta.method.groovy',
				'support.function.any-method.lua',
				'keyword.operator.function.infix',
			],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'entity.name.variable.parameter',
				'meta.at-rule.function variable',
				'meta.at-rule.mixin variable',
				'meta.function.arguments variable.other.php',
				'meta.selectionset.graphql meta.arguments.graphql variable.arguments.graphql',
				'variable.parameter',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'meta.decorator variable.other.readwrite',
				'meta.decorator variable.other.property',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#35C097',
			},
		},
		{
			scope: ['meta.decorator variable.other.object'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['keyword', 'punctuation.definition.keyword'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['keyword.control.new', 'keyword.operator.new'],
			settings: {
				fontStyle: 'bold',
			},
		},
		{
			scope: ['meta.selector'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['support'],
			settings: {
				fontStyle: 'italic',
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'support.function.magic',
				'support.variable',
				'variable.other.predefined',
			],
			settings: {
				fontStyle: 'regular',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['support.function', 'support.type.property-name'],
			settings: {
				fontStyle: 'regular',
			},
		},
		{
			scope: [
				'constant.other.symbol.hashkey punctuation.definition.constant.ruby',
				'entity.other.attribute-name.placeholder punctuation',
				'entity.other.attribute-name.pseudo-class punctuation',
				'entity.other.attribute-name.pseudo-element punctuation',
				'meta.group.double.toml',
				'meta.group.toml',
				'meta.object-binding-pattern-variable punctuation.destructuring',
				'punctuation.colon.graphql',
				'punctuation.definition.block.scalar.folded.yaml',
				'punctuation.definition.block.scalar.literal.yaml',
				'punctuation.definition.block.sequence.item.yaml',
				'punctuation.definition.entity.other.inherited-class',
				'punctuation.function.swift',
				'punctuation.separator.dictionary.key-value',
				'punctuation.separator.hash',
				'punctuation.separator.inheritance',
				'punctuation.separator.key-value',
				'punctuation.separator.key-value.mapping.yaml',
				'punctuation.separator.namespace',
				'punctuation.separator.pointer-access',
				'punctuation.separator.slice',
				'string.unquoted.heredoc punctuation.definition.string',
				'support.other.chomping-indicator.yaml',
				'punctuation.separator.annotation',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'keyword.operator.other.powershell',
				'keyword.other.statement-separator.powershell',
				'meta.brace.round',
				'meta.function-call punctuation',
				'punctuation.definition.arguments.begin',
				'punctuation.definition.arguments.end',
				'punctuation.definition.entity.begin',
				'punctuation.definition.entity.end',
				'punctuation.definition.tag.cs',
				'punctuation.definition.type.begin',
				'punctuation.definition.type.end',
				'punctuation.section.scope.begin',
				'punctuation.section.scope.end',
				'punctuation.terminator.expression.php',
				'storage.type.generic.java',
				'string.template meta.brace',
				'string.template punctuation.accessor',
			],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: [
				'meta.string-contents.quoted.double punctuation.definition.variable',
				'punctuation.definition.interpolation.begin',
				'punctuation.definition.interpolation.end',
				'punctuation.definition.template-expression.begin',
				'punctuation.definition.template-expression.end',
				'punctuation.section.embedded.begin',
				'punctuation.section.embedded.coffee',
				'punctuation.section.embedded.end',
				'punctuation.section.embedded.end source.php',
				'punctuation.section.embedded.end source.ruby',
				'punctuation.definition.variable.makefile',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'entity.name.function.target.makefile',
				'entity.name.section.toml',
				'entity.name.tag.yaml',
				'variable.other.key.toml',
			],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: ['constant.other.date', 'constant.other.timestamp'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['variable.other.alias.yaml'],
			settings: {
				fontStyle: 'italic underline',
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'storage',
				'meta.implementation storage.type.objc',
				'meta.interface-or-protocol storage.type.objc',
				'source.groovy storage.type.def',
			],
			settings: {
				fontStyle: 'regular',
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'entity.name.type',
				'keyword.primitive-datatypes.swift',
				'keyword.type.cs',
				'meta.protocol-list.objc',
				'meta.return-type.objc',
				'source.go storage.type',
				'source.groovy storage.type',
				'source.java storage.type',
				'source.powershell entity.other.attribute-name',
				'storage.class.std.rust',
				'storage.type.attribute.swift',
				'storage.type.c',
				'storage.type.core.rust',
				'storage.type.cs',
				'storage.type.groovy',
				'storage.type.objc',
				'storage.type.php',
				'storage.type.haskell',
				'storage.type.ocaml',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'entity.name.type.type-parameter',
				'meta.indexer.mappedtype.declaration entity.name.type',
				'meta.type.parameters entity.name.type',
			],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['storage.modifier'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'string.regexp',
				'constant.other.character-class.set.regexp',
				'constant.character.escape.backslash.regexp',
			],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['punctuation.definition.group.capture.regexp'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'string.regexp punctuation.definition.string.begin',
				'string.regexp punctuation.definition.string.end',
			],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['punctuation.definition.character-class.regexp'],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: ['punctuation.definition.group.regexp'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'punctuation.definition.group.assertion.regexp',
				'keyword.operator.negation.regexp',
			],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['meta.assertion.look-ahead.regexp'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['string'],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: [
				'punctuation.definition.string.begin',
				'punctuation.definition.string.end',
			],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'punctuation.support.type.property-name.begin',
				'punctuation.support.type.property-name.end',
			],
			settings: {
				foreground: '#97e2f2',
			},
		},
		{
			scope: [
				'string.quoted.docstring.multi',
				'string.quoted.docstring.multi.python punctuation.definition.string.begin',
				'string.quoted.docstring.multi.python punctuation.definition.string.end',
				'string.quoted.docstring.multi.python constant.character.escape',
			],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'variable',
				'constant.other.key.perl',
				'support.variable.property',
				'variable.other.constant.js',
				'variable.other.constant.ts',
				'variable.other.constant.tsx',
			],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: [
				'meta.import variable.other.readwrite',
				'meta.variable.assignment.destructured.object.coffee variable',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'meta.import variable.other.readwrite.alias',
				'meta.export variable.other.readwrite.alias',
				'meta.variable.assignment.destructured.object.coffee variable variable',
			],
			settings: {
				fontStyle: 'normal',
				foreground: '#09090B',
			},
		},
		{
			scope: ['meta.selectionset.graphql variable'],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['meta.selectionset.graphql meta.arguments variable'],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: ['entity.name.fragment.graphql', 'variable.fragment.graphql'],
			settings: {
				foreground: '#3177F6',
			},
		},
		{
			scope: [
				'constant.other.symbol.hashkey.ruby',
				'keyword.operator.dereference.java',
				'keyword.operator.navigation.groovy',
				'meta.scope.for-loop.shell punctuation.definition.string.begin',
				'meta.scope.for-loop.shell punctuation.definition.string.end',
				'meta.scope.for-loop.shell string',
				'storage.modifier.import',
				'punctuation.section.embedded.begin.tsx',
				'punctuation.section.embedded.end.tsx',
				'punctuation.section.embedded.begin.jsx',
				'punctuation.section.embedded.end.jsx',
				'punctuation.separator.list.comma.css',
				'constant.language.empty-list.haskell',
			],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: ['source.shell variable.other'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: ['support.constant'],
			settings: {
				fontStyle: 'normal',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['meta.scope.prerequisites.makefile'],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: ['meta.attribute-selector.scss'],
			settings: {
				foreground: '#7ECC00',
			},
		},
		{
			scope: [
				'punctuation.definition.attribute-selector.end.bracket.square.scss',
				'punctuation.definition.attribute-selector.begin.bracket.square.scss',
			],
			settings: {
				foreground: '#09090B',
			},
		},
		{
			scope: ['meta.preprocessor.haskell'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: ['log.error'],
			settings: {
				fontStyle: 'bold',
				foreground: '#ee6666',
			},
		},
		{
			scope: ['log.warning'],
			settings: {
				fontStyle: 'bold',
				foreground: '#7ECC00',
			},
		},
	],
	type: 'light',
}

export const darkTheme: ThemeRegistration = {
	name: 'wking-dark',
	colors: {
		'editor.background': '#18181b',
		'editor.foreground': '#ffffff',
		'editor.hoverHighlightBackground': '#8BE9FD50',
		'editor.lineHighlightBorder': '#44475A',
		'editor.rangeHighlightBackground': '#BD93F915',
		'editor.selectionBackground': '#44475A',
		'editor.selectionHighlightBackground': '#424450',
		'editor.snippetFinalTabstopHighlightBackground': '#18181b',
		'editor.snippetFinalTabstopHighlightBorder': '#35C097',
		'editor.snippetTabstopHighlightBackground': '#18181b',
		'editor.snippetTabstopHighlightBorder': '#9ca3af',
		'editor.wordHighlightBackground': '#8BE9FD50',
		'editor.wordHighlightStrongBackground': '#50FA7B50',
		'editorBracketHighlight.foreground1': '#ffffff',
		'editorBracketHighlight.foreground2': '#FF75DD',
		'editorBracketHighlight.foreground3': '#5FA1FB',
		'editorBracketHighlight.foreground4': '#35C097',
		'editorBracketHighlight.foreground5': '#7561FA',
		'editorBracketHighlight.foreground6': '#F28D45',
		'editorBracketHighlight.unexpectedBracket.foreground': '#ee6666',
		'editorCodeLens.foreground': '#9ca3af',
		'editorError.foreground': '#ee6666',
		'editorGroup.border': '#7561FA',
		'editorGroup.dropBackground': '#44475A70',
		'editorGroupHeader.tabsBackground': '#191A21',
		'editorGutter.addedBackground': '#50FA7B80',
		'editorGutter.deletedBackground': '#FF555580',
		'editorGutter.modifiedBackground': '#8BE9FD80',
		'editorHoverWidget.background': '#18181b',
		'editorHoverWidget.border': '#9ca3af',
		'editorIndentGuide.activeBackground': '#FFFFFF45',
		'editorIndentGuide.background': '#FFFFFF1A',
		'editorLineNumber.foreground': '#9ca3af',
		'editorLink.activeForeground': '#5FA1FB',
		'editorMarkerNavigation.background': '#262626',
		'editorOverviewRuler.addedForeground': '#50FA7B80',
		'editorOverviewRuler.border': '#191A21',
		'editorOverviewRuler.currentContentForeground': '#35C097',
		'editorOverviewRuler.deletedForeground': '#FF555580',
		'editorOverviewRuler.errorForeground': '#FF555580',
		'editorOverviewRuler.incomingContentForeground': '#7561FA',
		'editorOverviewRuler.infoForeground': '#8BE9FD80',
		'editorOverviewRuler.modifiedForeground': '#8BE9FD80',
		'editorOverviewRuler.selectionHighlightForeground': '#F28D45',
		'editorOverviewRuler.warningForeground': '#F28D4580',
		'editorOverviewRuler.wordHighlightForeground': '#5FA1FB',
		'editorOverviewRuler.wordHighlightStrongForeground': '#35C097',
		'editorRuler.foreground': '#FFFFFF1A',
		'editorSuggestWidget.background': '#262626',
		'editorSuggestWidget.foreground': '#ffffff',
		'editorSuggestWidget.selectedBackground': '#44475A',
		'editorWarning.foreground': '#5FA1FB',
		'editorWhitespace.foreground': '#FFFFFF1A',
		'editorWidget.background': '#262626',
		errorForeground: '#ee6666',
		'extensionButton.prominentBackground': '#50FA7B90',
		'extensionButton.prominentForeground': '#ffffff',
		'extensionButton.prominentHoverBackground': '#50FA7B60',
		focusBorder: '#9ca3af',
		foreground: '#ffffff',
		'gitDecoration.conflictingResourceForeground': '#F28D45',
		'gitDecoration.deletedResourceForeground': '#ee6666',
		'gitDecoration.ignoredResourceForeground': '#9ca3af',
		'gitDecoration.modifiedResourceForeground': '#5FA1FB',
		'gitDecoration.untrackedResourceForeground': '#35C097',
		'inlineChat.regionHighlight': '#343746',
		'input.background': '#18181b',
		'input.border': '#191A21',
		'input.foreground': '#ffffff',
		'input.placeholderForeground': '#9ca3af',
		'inputOption.activeBorder': '#7561FA',
		'inputValidation.errorBorder': '#ee6666',
		'inputValidation.infoBorder': '#FF75DD',
		'inputValidation.warningBorder': '#F28D45',
		'list.activeSelectionBackground': '#44475A',
		'list.activeSelectionForeground': '#ffffff',
		'list.dropBackground': '#44475A',
		'list.errorForeground': '#ee6666',
		'list.focusBackground': '#44475A75',
		'list.highlightForeground': '#5FA1FB',
		'list.hoverBackground': '#44475A75',
		'list.inactiveSelectionBackground': '#44475A75',
		'list.warningForeground': '#F28D45',
		'listFilterWidget.background': '#343746',
		'listFilterWidget.noMatchesOutline': '#ee6666',
		'listFilterWidget.outline': '#424450',
		'merge.currentHeaderBackground': '#50FA7B90',
		'merge.incomingHeaderBackground': '#BD93F990',
		'panel.background': '#18181b',
		'panel.border': '#7561FA',
		'panelTitle.activeBorder': '#FF75DD',
		'panelTitle.activeForeground': '#ffffff',
		'panelTitle.inactiveForeground': '#9ca3af',
		'peekView.border': '#44475A',
		'peekViewEditor.background': '#18181b',
		'peekViewEditor.matchHighlightBackground': '#F1FA8C80',
		'peekViewResult.background': '#262626',
		'peekViewResult.fileForeground': '#ffffff',
		'peekViewResult.lineForeground': '#ffffff',
		'peekViewResult.matchHighlightBackground': '#F1FA8C80',
		'peekViewResult.selectionBackground': '#44475A',
		'peekViewResult.selectionForeground': '#ffffff',
		'peekViewTitle.background': '#191A21',
		'peekViewTitleDescription.foreground': '#9ca3af',
		'peekViewTitleLabel.foreground': '#ffffff',
		'pickerGroup.border': '#7561FA',
		'pickerGroup.foreground': '#5FA1FB',
		'progressBar.background': '#FF75DD',
		'selection.background': '#7561FA',
		'settings.checkboxBackground': '#262626',
		'settings.checkboxBorder': '#191A21',
		'settings.checkboxForeground': '#ffffff',
		'settings.dropdownBackground': '#262626',
		'settings.dropdownBorder': '#191A21',
		'settings.dropdownForeground': '#ffffff',
		'settings.headerForeground': '#ffffff',
		'settings.modifiedItemIndicator': '#F28D45',
		'settings.numberInputBackground': '#262626',
		'settings.numberInputBorder': '#191A21',
		'settings.numberInputForeground': '#ffffff',
		'settings.textInputBackground': '#262626',
		'settings.textInputBorder': '#191A21',
		'settings.textInputForeground': '#ffffff',
		'sideBar.background': '#262626',
		'sideBarSectionHeader.background': '#18181b',
		'sideBarSectionHeader.border': '#191A21',
		'sideBarTitle.foreground': '#ffffff',
		'statusBar.background': '#191A21',
		'statusBar.debuggingBackground': '#ee6666',
		'statusBar.debuggingForeground': '#191A21',
		'statusBar.foreground': '#ffffff',
		'statusBar.noFolderBackground': '#191A21',
		'statusBar.noFolderForeground': '#ffffff',
		'statusBarItem.prominentBackground': '#ee6666',
		'statusBarItem.prominentHoverBackground': '#F28D45',
		'statusBarItem.remoteBackground': '#7561FA',
		'statusBarItem.remoteForeground': '#18181b',
		'tab.activeBackground': '#18181b',
		'tab.activeBorderTop': '#FF79C680',
		'tab.activeForeground': '#ffffff',
		'tab.border': '#191A21',
		'tab.inactiveBackground': '#262626',
		'tab.inactiveForeground': '#9ca3af',
		'terminal.ansiBlack': '#262626',
		'terminal.ansiBlue': '#7561FA',
		'terminal.ansiBrightBlack': '#9ca3af',
		'terminal.ansiBrightBlue': '#d6b4f7',
		'terminal.ansiBrightCyan': '#adf6f6',
		'terminal.ansiBrightGreen': '#78f09a',
		'terminal.ansiBrightMagenta': '#f49dda',
		'terminal.ansiBrightRed': '#f07c7c',
		'terminal.ansiBrightWhite': '#ffffff',
		'terminal.ansiBrightYellow': '#f6f6ae',
		'terminal.ansiCyan': '#5FA1FB',
		'terminal.ansiGreen': '#35C097',
		'terminal.ansiMagenta': '#FF75DD',
		'terminal.ansiRed': '#ee6666',
		'terminal.ansiWhite': '#ffffff',
		'terminal.ansiYellow': '#EFBD2D',
		'terminal.background': '#18181b',
		'terminal.foreground': '#ffffff',
		'titleBar.activeBackground': '#262626',
		'titleBar.activeForeground': '#ffffff',
		'titleBar.inactiveBackground': '#191A21',
		'titleBar.inactiveForeground': '#9ca3af',
		'walkThrough.embeddedEditorBackground': '#262626',
	},
	displayName: 'Craft Lab',
	semanticHighlighting: true,
	tokenColors: [
		{
			scope: ['emphasis'],
			settings: {
				fontStyle: 'italic',
			},
		},
		{
			scope: ['strong'],
			settings: {
				fontStyle: 'bold',
			},
		},
		{
			scope: ['header'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: ['meta.diff', 'meta.diff.header'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: ['markup.inserted'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['markup.deleted'],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['markup.changed'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['invalid'],
			settings: {
				fontStyle: 'underline italic',
				foreground: '#ee6666',
			},
		},
		{
			scope: ['invalid.deprecated'],
			settings: {
				fontStyle: 'underline italic',
				foreground: '#ffffff',
			},
		},
		{
			scope: ['entity.name.filename'],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['markup.error'],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['markup.underline'],
			settings: {
				fontStyle: 'underline',
			},
		},
		{
			scope: ['markup.bold'],
			settings: {
				fontStyle: 'bold',
				foreground: '#F28D45',
			},
		},
		{
			scope: ['markup.heading'],
			settings: {
				fontStyle: 'bold',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['markup.italic'],
			settings: {
				fontStyle: 'italic',
				foreground: '#EFBD2D',
			},
		},
		{
			scope: [
				'beginning.punctuation.definition.list.markdown',
				'beginning.punctuation.definition.quote.markdown',
				'punctuation.definition.link.restructuredtext',
			],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: ['markup.inline.raw', 'markup.raw.restructuredtext'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['markup.underline.link', 'markup.underline.link.image'],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'meta.link.reference.def.restructuredtext',
				'punctuation.definition.directive.restructuredtext',
				'string.other.link.description',
				'string.other.link.title',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.name.directive.restructuredtext', 'markup.quote'],
			settings: {
				fontStyle: 'italic',
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['meta.separator.markdown'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'fenced_code.block.language',
				'markup.raw.inner.restructuredtext',
				'markup.fenced_code.block.markdown punctuation.definition.markdown',
			],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['punctuation.definition.constant.restructuredtext'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'markup.heading.markdown punctuation.definition.string.begin',
				'markup.heading.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'meta.paragraph.markdown punctuation.definition.string.begin',
				'meta.paragraph.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: [
				'markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.begin',
				'markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.end',
			],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['entity.name.type.class', 'entity.name.class'],
			settings: {
				fontStyle: 'normal',
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'keyword.expressions-and-types.swift',
				'keyword.other.this',
				'variable.language',
				'variable.language punctuation.definition.variable.php',
				'variable.other.readwrite.instance.ruby',
				'variable.parameter.function.language.special',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['entity.other.inherited-class'],
			settings: {
				fontStyle: 'italic',
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'comment',
				'punctuation.definition.comment',
				'unused.comment',
				'wildcard.comment',
			],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'comment keyword.codetag.notation',
				'comment.block.documentation keyword',
				'comment.block.documentation storage.type.class',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['comment.block.documentation entity.name.type'],
			settings: {
				fontStyle: 'italic',
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'comment.block.documentation entity.name.type punctuation.definition.bracket',
			],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: ['comment.block.documentation variable'],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: ['constant', 'variable.other.constant'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: [
				'constant.character.escape',
				'constant.character.string.escape',
				'constant.regexp',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.name.tag'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.other.attribute-name.parent-selector'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['entity.other.attribute-name'],
			settings: {
				fontStyle: 'italic',
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'entity.name.function',
				'meta.function-call.object',
				'meta.function-call.php',
				'meta.function-call.static',
				'meta.method-call.java meta.method',
				'meta.method.groovy',
				'support.function.any-method.lua',
				'keyword.operator.function.infix',
			],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'entity.name.variable.parameter',
				'meta.at-rule.function variable',
				'meta.at-rule.mixin variable',
				'meta.function.arguments variable.other.php',
				'meta.selectionset.graphql meta.arguments.graphql variable.arguments.graphql',
				'variable.parameter',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'meta.decorator variable.other.readwrite',
				'meta.decorator variable.other.property',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#35C097',
			},
		},
		{
			scope: ['meta.decorator variable.other.object'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['keyword', 'punctuation.definition.keyword'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['keyword.control.new', 'keyword.operator.new'],
			settings: {
				fontStyle: 'bold',
			},
		},
		{
			scope: ['meta.selector'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: ['support'],
			settings: {
				fontStyle: 'italic',
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'support.function.magic',
				'support.variable',
				'variable.other.predefined',
			],
			settings: {
				fontStyle: 'regular',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['support.function', 'support.type.property-name'],
			settings: {
				fontStyle: 'regular',
			},
		},
		{
			scope: [
				'constant.other.symbol.hashkey punctuation.definition.constant.ruby',
				'entity.other.attribute-name.placeholder punctuation',
				'entity.other.attribute-name.pseudo-class punctuation',
				'entity.other.attribute-name.pseudo-element punctuation',
				'meta.group.double.toml',
				'meta.group.toml',
				'meta.object-binding-pattern-variable punctuation.destructuring',
				'punctuation.colon.graphql',
				'punctuation.definition.block.scalar.folded.yaml',
				'punctuation.definition.block.scalar.literal.yaml',
				'punctuation.definition.block.sequence.item.yaml',
				'punctuation.definition.entity.other.inherited-class',
				'punctuation.function.swift',
				'punctuation.separator.dictionary.key-value',
				'punctuation.separator.hash',
				'punctuation.separator.inheritance',
				'punctuation.separator.key-value',
				'punctuation.separator.key-value.mapping.yaml',
				'punctuation.separator.namespace',
				'punctuation.separator.pointer-access',
				'punctuation.separator.slice',
				'string.unquoted.heredoc punctuation.definition.string',
				'support.other.chomping-indicator.yaml',
				'punctuation.separator.annotation',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'keyword.operator.other.powershell',
				'keyword.other.statement-separator.powershell',
				'meta.brace.round',
				'meta.function-call punctuation',
				'punctuation.definition.arguments.begin',
				'punctuation.definition.arguments.end',
				'punctuation.definition.entity.begin',
				'punctuation.definition.entity.end',
				'punctuation.definition.tag.cs',
				'punctuation.definition.type.begin',
				'punctuation.definition.type.end',
				'punctuation.section.scope.begin',
				'punctuation.section.scope.end',
				'punctuation.terminator.expression.php',
				'storage.type.generic.java',
				'string.template meta.brace',
				'string.template punctuation.accessor',
			],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: [
				'meta.string-contents.quoted.double punctuation.definition.variable',
				'punctuation.definition.interpolation.begin',
				'punctuation.definition.interpolation.end',
				'punctuation.definition.template-expression.begin',
				'punctuation.definition.template-expression.end',
				'punctuation.section.embedded.begin',
				'punctuation.section.embedded.coffee',
				'punctuation.section.embedded.end',
				'punctuation.section.embedded.end source.php',
				'punctuation.section.embedded.end source.ruby',
				'punctuation.definition.variable.makefile',
			],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'entity.name.function.target.makefile',
				'entity.name.section.toml',
				'entity.name.tag.yaml',
				'variable.other.key.toml',
			],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: ['constant.other.date', 'constant.other.timestamp'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['variable.other.alias.yaml'],
			settings: {
				fontStyle: 'italic underline',
				foreground: '#35C097',
			},
		},
		{
			scope: [
				'storage',
				'meta.implementation storage.type.objc',
				'meta.interface-or-protocol storage.type.objc',
				'source.groovy storage.type.def',
			],
			settings: {
				fontStyle: 'regular',
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'entity.name.type',
				'keyword.primitive-datatypes.swift',
				'keyword.type.cs',
				'meta.protocol-list.objc',
				'meta.return-type.objc',
				'source.go storage.type',
				'source.groovy storage.type',
				'source.java storage.type',
				'source.powershell entity.other.attribute-name',
				'storage.class.std.rust',
				'storage.type.attribute.swift',
				'storage.type.c',
				'storage.type.core.rust',
				'storage.type.cs',
				'storage.type.groovy',
				'storage.type.objc',
				'storage.type.php',
				'storage.type.haskell',
				'storage.type.ocaml',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'entity.name.type.type-parameter',
				'meta.indexer.mappedtype.declaration entity.name.type',
				'meta.type.parameters entity.name.type',
			],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: ['storage.modifier'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'string.regexp',
				'constant.other.character-class.set.regexp',
				'constant.character.escape.backslash.regexp',
			],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['punctuation.definition.group.capture.regexp'],
			settings: {
				foreground: '#FF75DD',
			},
		},
		{
			scope: [
				'string.regexp punctuation.definition.string.begin',
				'string.regexp punctuation.definition.string.end',
			],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['punctuation.definition.character-class.regexp'],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: ['punctuation.definition.group.regexp'],
			settings: {
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'punctuation.definition.group.assertion.regexp',
				'keyword.operator.negation.regexp',
			],
			settings: {
				foreground: '#ee6666',
			},
		},
		{
			scope: ['meta.assertion.look-ahead.regexp'],
			settings: {
				foreground: '#35C097',
			},
		},
		{
			scope: ['string'],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: [
				'punctuation.definition.string.begin',
				'punctuation.definition.string.end',
			],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'punctuation.support.type.property-name.begin',
				'punctuation.support.type.property-name.end',
			],
			settings: {
				foreground: '#97e2f2',
			},
		},
		{
			scope: [
				'string.quoted.docstring.multi',
				'string.quoted.docstring.multi.python punctuation.definition.string.begin',
				'string.quoted.docstring.multi.python punctuation.definition.string.end',
				'string.quoted.docstring.multi.python constant.character.escape',
			],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: [
				'variable',
				'constant.other.key.perl',
				'support.variable.property',
				'variable.other.constant.js',
				'variable.other.constant.ts',
				'variable.other.constant.tsx',
			],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: [
				'meta.import variable.other.readwrite',
				'meta.variable.assignment.destructured.object.coffee variable',
			],
			settings: {
				fontStyle: 'italic',
				foreground: '#F28D45',
			},
		},
		{
			scope: [
				'meta.import variable.other.readwrite.alias',
				'meta.export variable.other.readwrite.alias',
				'meta.variable.assignment.destructured.object.coffee variable variable',
			],
			settings: {
				fontStyle: 'normal',
				foreground: '#ffffff',
			},
		},
		{
			scope: ['meta.selectionset.graphql variable'],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['meta.selectionset.graphql meta.arguments variable'],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: ['entity.name.fragment.graphql', 'variable.fragment.graphql'],
			settings: {
				foreground: '#5FA1FB',
			},
		},
		{
			scope: [
				'constant.other.symbol.hashkey.ruby',
				'keyword.operator.dereference.java',
				'keyword.operator.navigation.groovy',
				'meta.scope.for-loop.shell punctuation.definition.string.begin',
				'meta.scope.for-loop.shell punctuation.definition.string.end',
				'meta.scope.for-loop.shell string',
				'storage.modifier.import',
				'punctuation.section.embedded.begin.tsx',
				'punctuation.section.embedded.end.tsx',
				'punctuation.section.embedded.begin.jsx',
				'punctuation.section.embedded.end.jsx',
				'punctuation.separator.list.comma.css',
				'constant.language.empty-list.haskell',
			],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: ['source.shell variable.other'],
			settings: {
				foreground: '#7561FA',
			},
		},
		{
			scope: ['support.constant'],
			settings: {
				fontStyle: 'normal',
				foreground: '#7561FA',
			},
		},
		{
			scope: ['meta.scope.prerequisites.makefile'],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: ['meta.attribute-selector.scss'],
			settings: {
				foreground: '#EFBD2D',
			},
		},
		{
			scope: [
				'punctuation.definition.attribute-selector.end.bracket.square.scss',
				'punctuation.definition.attribute-selector.begin.bracket.square.scss',
			],
			settings: {
				foreground: '#ffffff',
			},
		},
		{
			scope: ['meta.preprocessor.haskell'],
			settings: {
				foreground: '#9ca3af',
			},
		},
		{
			scope: ['log.error'],
			settings: {
				fontStyle: 'bold',
				foreground: '#ee6666',
			},
		},
		{
			scope: ['log.warning'],
			settings: {
				fontStyle: 'bold',
				foreground: '#EFBD2D',
			},
		},
	],
	type: 'dark',
}
