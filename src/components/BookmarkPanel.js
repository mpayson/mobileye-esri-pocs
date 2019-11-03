import React from 'react';
import { observer } from "mobx-react";
import { Card, Button } from 'antd';

class BookmarkPanelItem extends React.PureComponent {

  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render(){
    const b = this.props.bookmark;
    return(
      <Card style={{marginBottom: "3px"}} key={b.name}>
        <h3 style={{margin: 0, display: "inline-block", marginBottom: "20px"}}>{b.name}</h3>
        <Button style={{float: "right"}} ghost type="primary" onClick={this.onClick}>Go</Button>
      </Card>
    )
  }
}

const BookmarkPanel = observer(({store}) => {

  const bookmarkViews = store.bookmarks.map((b,i) => 
    <BookmarkPanelItem bookmark={b} id={i} key={b.name} onClick={store.onBookmarkClick}/>
  )

  return(
    <>
      {bookmarkViews}
    </>
  )
});

export default BookmarkPanel;

