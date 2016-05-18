/* @flow */
'use strict';

import React from 'react';
import {Image} from 'react-native-desktop';
import NativeBaseComponent from '../Base/NativeBaseComponent';
import computeProps from '../../Utils/computeProps';
import Icon from './Icon';
import Text from './Text';
import View from './View';
import Button from './Button';
import Thumbnail from './Thumbnail';

export default class ListItemNB extends NativeBaseComponent {

    getInitialStyle() {
        return {
            listItem: {
                borderBottomWidth: this.getTheme().borderWidth,
                padding: (this.imagePresent() && !this.ifShowCase()) ? 0 : this.getTheme().listItemPadding,
                borderRadius: 1,
                flex: 1,
                justifyContent: (this.buttonPresent()) ? 'space-between' : 'flex-start',
                flexDirection: (this.thumbnailPresent() || this.iconPresent() || (this.notePresent() && this.ifShowCase())) ? 'row' : 'column',
                borderColor: this.getTheme().listBorderColor
            },
            listItemDivider: {
                borderBottomWidth: this.getTheme().borderWidth,
                padding: this.getTheme().listItemPadding,
                backgroundColor: this.getTheme().listDividerBg,
                flex: 1,
                justifyContent: (this.buttonPresent()) ? 'space-between' : 'flex-start',
                flexDirection: 'row',
                borderColor: this.getTheme().listBorderColor
            },
            itemText: {
                fontSize: this.ifShowCase() ? 14 : 15, 
                marginTop:  this.ifShowCase() ? 10 : 0
            },
            dividerItemText: {
                fontSize: 16,  
                fontWeight: '500'
            },
            itemIcon: {
                fontSize: this.getTheme().iconFontSize,
                color: 'black'
            },
            itemNote: {
                fontSize: 15,
                color: this.getTheme().listNoteColor,
                fontWeight: '100',
                flex: 1
            },
            itemSubNote: {
                fontSize: 15,
                color: '#999'
            },
            thumbnail: {
                alignSelf: 'center'
            },
            fullImage: {
                alignSelf: 'stretch',                    
                height: this.ifShowCase() ? 120 : 300
            }
        }
    }
    getRightStyle() {
        return {
            right : {
                flex: 1,
                paddingLeft: 10                
            },
            right2 : {
                flex: 1,
                flexDirection: 'row',
                paddingLeft: 10,
                alignItems: 'center',
                justifyContent: 'space-between'
            },
            right3 : {
                flex: 1,
                flexDirection: 'column',
                paddingLeft: 10,
                justifyContent: 'flex-start'
            }
        }
    }

    thumbnailPresent() {
        var thumbnailComponentPresent = false;
        React.Children.forEach(this.props.children, function (child) {
            if(child.type == Thumbnail)
                thumbnailComponentPresent = true;
        })

        return thumbnailComponentPresent;
    }

    imagePresent() {
        var imagePresent = false;
        React.Children.forEach(this.props.children, function (child) {
            if(child.type == Image)
                imagePresent = true;
        })

        return imagePresent;
    }

    iconPresent() {
        var iconComponentPresent = false;
        React.Children.forEach(this.props.children, function (child) {
            if(child.type == Icon)
                iconComponentPresent = true;
        })

        return iconComponentPresent;
    }

    buttonPresent() {
        var buttonComponentPresent = false;
        React.Children.forEach(this.props.children, function (child) {
            if(child.type == Button)
                buttonComponentPresent = true;
        })

        return buttonComponentPresent;
    }

    ifShowCase() {
        var ifShowCase = false;

        if(this.props.cardBody) {
            ifShowCase = true;
        }


        return ifShowCase;   
    }

    notePresent() {
        var notePresent = false;

        React.Children.forEach(this.props.children, function (child) {
            if(child.type == Text && child.props.note)
                notePresent = true;
        });

        return notePresent;
    }

    squareThumbs() {
        var squareThumbs = false;
        if (this.thumbnailPresent()) {
            React.Children.forEach(this.props.children, function (child) {
                if(child.props.square)
                    squareThumbs = true;
            });
        }

        return squareThumbs;
    }

    getChildProps(child) {
        var defaultProps = {};
        if(child.type == Image && !Array.isArray(this.props.children)) {
            defaultProps = {
                resizeMode: 'stretch', 
                style: this.getInitialStyle().fullImage
            }
        }
        else if(child.type == Button) {
            defaultProps = {
                small: true,
                style: this.getInitialStyle().itemButton
            }
        }
        else if(child.type == Text) {
            if ((this.props.header) || (this.props.footer)) {
                defaultProps = {
                    style: this.getInitialStyle().dividerItemText
                }
            } 
            else {
                if(child.props.note && this.thumbnailPresent()) {
                    defaultProps = {
                        style: this.getInitialStyle().itemSubNote
                    }
                }
                else if(child.props.note) {
                    defaultProps = {
                        style: this.getInitialStyle().itemNote
                    }
                }
                else {
                    defaultProps = {
                        style: this.getInitialStyle().itemText
                    }
                }
            }
        }
        else if(child.type == Icon) {
            defaultProps = {
                style: this.getInitialStyle().itemIcon
            }
        }
        else if(child.type == Thumbnail) {
            defaultProps = {
                style: this.getInitialStyle().thumbnail
            }
        }
        else if(child.type == Image ) {
            defaultProps = {
                style: this.getInitialStyle().fullImage
            }
        }
        else {
            defaultProps = {
                style: {}
            }
        }

        return computeProps(child.props, defaultProps);
    }

    prepareRootProps() {
        var defaultProps = {};

        if((this.props.header) || (this.props.footer)) {
            defaultProps = {
                style: this.getInitialStyle().listItemDivider
            };
        }

        else { 
            defaultProps = {
                style: this.getInitialStyle().listItem
            };
        }

        return computeProps(this.props, defaultProps);
    }




    renderChildren() {
        var newChildren = [];

        if(!this.thumbnailPresent() && !this.iconPresent()) {
            newChildren = React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, this.getChildProps(child));
            });
        } 
        else {
            newChildren = [];
            if(!Array.isArray(this.props.children)) {
                newChildren.push(
                    <View style={{justifyContent: 'flex-start'}}>
                        {React.cloneElement(this.props.children, this.getChildProps(this.props.children))}
                    </View>
                );
            }
            else {
                var childrenArray = React.Children.toArray(this.props.children);
                newChildren.push(React.cloneElement(childrenArray[0], this.getChildProps(childrenArray[0])));
                newChildren.push(
                    <View style={ this.notePresent() ? this.getRightStyle().right : this.squareThumbs() ? this.getRightStyle().right3 : this.getRightStyle().right2 }>
                        {childrenArray.slice(1).map((child) => {
                            return React.cloneElement(child, this.getChildProps(child));
                        })}
                    </View>
                );
            }
        }

        return newChildren;
    }


    render() { 
        return(
            <View {...this.prepareRootProps()} >
                {this.renderChildren()}
            </View>
        );
    }
}