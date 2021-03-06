import './style';
import React from 'react';
import PropTypes from 'prop-types';

let handlerID; // 为了清除window上的scroll事件

class LoadMore extends React.PureComponent {
    /**
     * 监听滚动事件，并处理回调
     */
    _loadMore() {
        let timeoutID;
        window.addEventListener('scroll', this._scrollHandler(timeoutID, this));
    }

    /**
     * scroll事件的处理
     * @param {*number} timeoutID 计时器的ID，为了可以clear
     * @param {*object} thisComponent 上下文
     */
    _scrollHandler(timeoutID, thisComponent) {
        return handlerID = e => {
            // 如果处于正在获取数据的状态，则不调用获取数据
            if (thisComponent.props.isLoading) {
                return;
            }
            // 如果hasMore为false了，说明没数据了，清除scroll的事件
            if (!thisComponent.props.hasMore) {
                window.removeEventListener('scroll', handlerID);
            }
            if (timeoutID) {
                clearTimeout(timeoutID)
            }
            // 节流
            timeoutID = setTimeout(this._callBack.bind(thisComponent), 50);
        }
    }

    /**
     * 当LoadMore元素出现在页面可视范围中，则调用获取数据
     */
    _callBack() {
        let loadMoreNode = this.refs.loadMoreNode;
        let top = loadMoreNode.getBoundingClientRect().top,
            screenHeight = window.screen.height;
        console.log('top: ', top);
        console.log('screenHeight: ',screenHeight);
        if (top && top < screenHeight) {
            console.log(`get the data, and the top is ${top}, screenHeight is ${screenHeight}`);
            this.props.onLoadMore();
        }
    }

    componentDidMount() {
        this._loadMore();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', handlerID);
    }
    
    
    render() {
        let text;
        if (!this.props.hasMore) {
            text = '没有更多了~';
        } else if (this.props.isLoading) {
            text = '加载中...';
        } else {
            text = '上拉加载更多';
        }
        return (
            <div class="loadMore" ref="loadMoreNode">
                {text}
            </div>
        );
    }
}

LoadMore.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired
};

export default LoadMore;
