import React from 'react';
import { observer } from "mobx-react";
import { Card, Button, Divider } from 'antd';



class BookmarkPanelItem extends React.PureComponent {

  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render(){
    const b = this.props.bookmark;
    return(
      <Card style={{marginBottom: "3px"}} key={b.name}>
        <h3 style={{margin: 0, display: "inline-block", maxWidth: '80%'}}>{b.name}</h3>
        <Button style={{float: "right"}} ghost type="primary" onClick={this.onClick}>Go</Button>
      </Card>
    )
  }
}

const BookmarkPanel = observer(class BookmarkPanel extends React.Component {

  constructor(props, context){
    super(props, context);
    this.onAutoplayClick = this.onAutoplayClick.bind(this);
  }

  // componentWillUnmount(){
  //   this.props.store.stopAutoplayBookmarks();
  // }

  onAutoplayClick(){
    const store = this.props.store;
    if(store.autoplay){
      this.props.store.stopAutoplayBookmarks();
    } else {
      this.props.store.startAutoplayBookmarks();
    }
  }

  render(){
    const store = this.props.store;

    const bookmarkViews = store.bookmarks.map((b,i) => 
      <BookmarkPanelItem bookmark={b} id={i} key={b.name} onClick={store.onBookmarkClick}/>
    )

    const icon = store.autoplay ? "pause" : "caret-right";

    return(
      <>
        {bookmarkViews}
        <Divider/>
        <Button block type="primary" icon={icon} onClick={this.onAutoplayClick}/>
      </>
    )
  }
});


export default BookmarkPanel;

