/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 * User: Julia.Svinareva
 * Date: 11.02.2022
 */

define([
    'text!common/main/lib/template/SearchPanel.template',
    'common/main/lib/util/utils',
    'common/main/lib/component/BaseView',
    'common/main/lib/component/Layout'
], function (template) {
    'use strict';

    Common.Views.SearchPanel = Common.UI.BaseView.extend(_.extend({
        el: '#left-panel-search',
        template: _.template(template),

        initialize: function(options) {
            _.extend(this, options);
            Common.UI.BaseView.prototype.initialize.call(this, arguments);

            this.isEdit = options.mode.isEdit;
        },

        render: function(el) {
            if (!this.rendered) {
                el = el || this.el;
                $(el).html(this.template({
                    scope: this,
                    headerText: this.isEdit ? this.textFindAndReplace : this.textFind
                }));
                this.$el = $(el);

                this.inputText = new Common.UI.InputField({
                    el: $('#search-adv-text'),
                    placeHolder: this.textFind,
                    allowBlank: true,
                    validateOnBlur: false,
                    style: 'width: 100%;'
                });

                this.inputReplace = new Common.UI.InputField({
                    el: $('#search-adv-replace-text'),
                    placeHolder: this.textReplaceWith,
                    allowBlank: true,
                    validateOnBlur: false,
                    style: 'width: 100%;'
                });

                this.$reaultsNumber = $('#search-adv-results-number');

                this.btnBack = new Common.UI.Button({
                    parentEl: $('#search-adv-back'),
                    cls: 'btn-toolbar',
                    iconCls: 'toolbar__icon btn-arrow-up',
                    dataHint: '1',
                    dataHintDirection: 'bottom'
                });
                this.btnBack.on('click', _.bind(this.onBtnClick, this, 'next'));

                this.btnNext = new Common.UI.Button({
                    parentEl: $('#search-adv-next'),
                    cls: 'btn-toolbar',
                    iconCls: 'toolbar__icon btn-arrow-down',
                    dataHint: '1',
                    dataHintDirection: 'bottom'
                });
                this.btnNext.on('click', _.bind(this.onBtnClick, this, 'next'));

                this.btnReplace = new Common.UI.Button({
                    el: $('#search-adv-replace')
                });
                this.btnReplace.on('click', _.bind(this.onBtnClick, this, 'replace'));

                this.btnReplaceAll = new Common.UI.Button({
                    el: $('#search-adv-replace-all')
                });
                this.btnReplaceAll.on('click', _.bind(this.onBtnClick, this, 'replaceall'));

                this.chCaseSensitive = new Common.UI.CheckBox({
                    el: $('#search-adv-case-sensitive'),
                    labelText: this.textCaseSensitive,
                    dataHint: '1',
                    dataHintDirection: 'left',
                    dataHintOffset: 'small'
                });

                this.chUseRegExp = new Common.UI.CheckBox({
                    el: $('#search-adv-use-regexp'),
                    labelText: this.textMatchUsingRegExp,
                    dataHint: '1',
                    dataHintDirection: 'left',
                    dataHintOffset: 'small'
                });

                this.chMatchWord = new Common.UI.CheckBox({
                    el: $('#search-adv-match-word'),
                    labelText: this.options.matchwordstr || this.textWholeWords,
                    dataHint: '1',
                    dataHintDirection: 'left',
                    dataHintOffset: 'small'
                });

                this.cmbWithin = new Common.UI.ComboBox({
                    el: $('#search-adv-cmb-within'),
                    menuStyle: 'min-width: 100%;',
                    style: "width: 219px;",
                    editable: false,
                    cls: 'input-group-nr',
                    data: [
                        { value: 0, displayValue: this.textSheet },
                        { value: 1, displayValue: this.textWorkbook }
                    ]
                });

                this.cmbSearch = new Common.UI.ComboBox({
                    el: $('#search-adv-cmb-search'),
                    menuStyle: 'min-width: 100%;',
                    style: "width: 219px;",
                    editable: false,
                    cls: 'input-group-nr',
                    data: [
                        { value: 0, displayValue: this.textByRows },
                        { value: 1, displayValue: this.textByColumns }
                    ]
                });

                this.cmbLookIn = new Common.UI.ComboBox({
                    el: $('#search-adv-cmb-look-in'),
                    menuStyle: 'min-width: 100%;',
                    style: "width: 219px;",
                    editable: false,
                    cls: 'input-group-nr',
                    data: [
                        { value: 0, displayValue: this.textFormulas },
                        { value: 1, displayValue: this.textValues }
                    ]
                });

                this.buttonClose = new Common.UI.Button({
                    parentEl: $('#search-btn-close', this.$el),
                    cls: 'btn-toolbar',
                    iconCls: 'toolbar__icon btn-close',
                    hint: this.textCloseSearch
                });
                this.buttonClose.on('click', _.bind(this.onClickClosePanel, this));
            }

            this.rendered = true;
            this.trigger('render:after', this);
            return this;
        },

        show: function () {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.fireEvent('show', this );
        },

        hide: function () {
            Common.UI.BaseView.prototype.hide.call(this,arguments);
            this.fireEvent('hide', this );
        },

        focus: function() {
            var me  = this;
            setTimeout(function(){
                me.inputText.$el.find('input').focus();
                me.inputText.$el.find('input').select();
            }, 10);
        },

        ChangeSettings: function(props) {
        },

        updateResultsNumber: function (current, count) {
            this.$reaultsNumber.text(Common.Utils.String.format(current, count));
        },

        onClickClosePanel: function() {
            Common.NotificationCenter.trigger('leftmenu:change', 'hide');
        },

        onBtnClick: function(action) {
            var opts = {
                textsearch  : this.inputText.getValue(),
                textreplace : this.inputReplace.getValue(),
                matchcase   : this.chCaseSensitive.checked,
                useregexp   : this.chUseRegExp.checked,
                matchword   : this.chMatchWord.checked,
                //highlight   : this.miHighlight.checked
            };
            this.fireEvent('search:'+action, [this, opts, true]);
        },

        getSettings: function() {
            return {
                textsearch: this.inputText.getValue(),
                matchcase: this.chCaseSensitive.checked,
                matchword: this.chMatchWord.checked
            };
        },

        textFind: 'Find',
        textFindAndReplace: 'Find and replace',
        textCloseSearch: 'Close search',
        textReplace: 'Replace',
        textReplaceAll: 'Replace All',
        textSearchResults: 'Search results: {0}/{1}',
        textReplaceWith: 'Replace with',
        textCaseSensitive: 'Case sensitive',
        textMatchUsingRegExp: 'Match using regular expressions',
        textWholeWords: 'Whole words only',
        textWithin: 'Within',
        textSearch: 'Search',
        textLookIn: 'Look in',
        textSheet: 'Sheet',
        textWorkbook: 'Workbook',
        textByRows: 'By rows',
        textByColumns: 'By columns',
        textFormulas: 'Formulas',
        textValues: 'Values',

    }, Common.Views.SearchPanel || {}));
});