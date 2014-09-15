(function ($) {

    var TEMPLATE    = 
        '<div class="col-sm-12"> \n' +
        '   <div class="form-group">\n' +
        '      <label">\n' +
        '          {labelResource} \n' +
        '       </label> \n' +
        '       {formResource} \n' +
        '   </div> \n' +
        '</div>',
        
        isEmpty = function (value, trim) {
            return value === null || value === undefined || value == []
                || value === '' || trim && $.trim(value) === '';
        },
        uniqId      = function () {
            return Math.round(new Date().getTime() + (Math.random() * 100));
        },
        textCapitalize = function(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        isJsonString = function(str)
        {
            try {
                if ( typeof $.parseJSON(str) != "undefined" ) {
                    return true
                }
            } catch (e) {
                return false;
            }
        },
        arrayToObject = function(name, value, is_stringify)
        {
            var obj = {};
            for (var i = 0; i < name.length; ++i)
            {
                obj[name[i]] = value[i];
            }
            return (is_stringify) ? JSON.stringify(obj) : obj ;
        },
        exception = function(message)
        {
            $.error('Formcok Exception : '+ message);
        }

    var FormCok = function (element, options) {
        this.$element   = $(element);
        this.init(options);
        this.render();
        this.listen();
    };

    FormCok.prototype = {
        constructor: FormCok,
        init: function (options) {
            this.options            = options;
            this.template           = options.template;
            this.currentValue       = ( isJsonString(this.$element.val()) ) ? $.parseJSON(this.$element.val()) : false ;
            this.fields             = this.getFields();

            if (isEmpty(this.$element.attr('id'))) {
                this.$element.attr('id', uniqId());
            }
            this.classEvent         = this.$element.attr('name') +'_items_'+ uniqId();
        },
        getFields: function()
        {
            if( typeof this.options.fields !== 'undefined' )
            {
                return this.options.fields;
            } else if( isJsonString(this.$element.attr('data-fields')) ) {
                return $.parseJSON( this.$element.attr('data-fields') );
            }            
        },
        getTotalFields: function()
        {
            return Object.keys(this.fields).length;
        },
        generateFields: function()
        {
            var fields = this.fields,
                result = [];

            for (var key in fields) {
                var fieldName   = key,
                    fieldType   = fields[key],
                    value       = (typeof this.currentValue[fieldName] !== "undefined") 
                                ? this.currentValue[fieldName]
                                : '',
                    label, form;

                label   = textCapitalize(fieldName);

                switch (fieldType) {
                    case 'text':
                        form    = '<input type="text" class="form-control '+this.classEvent+'" name="'+ fieldName +'" value="'+ value +'" />';
                    break;
                    case 'textarea':
                        form    = '<textarea class="form-control '+this.classEvent+'" name="'+ fieldName +'" rows="4" >'+ value +'</textarea>';
                    break;
                    default:
                        exception('Field type of '+ label +' "'+ fieldType +'" not defined');
                        form    = false;
                    break;
                }

                if (form !== false) {
                    result.push({"name":fieldName, "label":label, "form":form});
                };
            }
            return result;
        },
        render: function()
        {
            var generatedFields = this.generateFields(),
                itemId = [],
                result = [];
            
            for (var key in generatedFields) {
                result += this.template
                    .replace('{formResource}', generatedFields[key].form)
                    .replace('{labelResource}', generatedFields[key].label);
            }

            this.$element.before(result);
            this.$element.css({'visibility':'', 'position':''});
            return result;
        },
        listen: function()
        {
            var targetEl    = this.$element,
                itemClass   = '.'+ this.classEvent;

            $(itemClass).keyup(function()
            {
                var itemName    = $(itemClass).map(function(i,v)
                {
                    return $(v).attr('name');
                }).get(),
                itemValue   = $(itemClass).map(function(i,v)
                {
                    return $(v).val();
                }).get();

                return targetEl.val( arrayToObject(itemName, itemValue, true) );
            });
        }
    };

    $.fn.formcok = function (option) {

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('formcok'),
                options = typeof option === 'object' && option;
                options_merged  = $.extend( {}, $.fn.formcok.defaults, $(this).data(), options );

            $this.data(
                'formcok', ( data = new FormCok(this, options_merged) )
            );
        });

    };

    $.fn.formcok.defaults = {
        template: TEMPLATE,
        fields: {"title":"text"}
    };

})(window.jQuery);