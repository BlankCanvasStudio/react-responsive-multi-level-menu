import React, { useState, useRef, useEffect } from 'react'; //eslint-disable-line
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import MenuItem from '../MenuItem';

const MenuItems = ({
  Data,
  animation,
  showMenuItems,
  color,
  textColor,
  width
}) => {
  const [offset, setOffset] = useState(null);
  const menuItemsRef = useRef(null);
  useEffect(() => {
    if (
      menuItemsRef.current &&
      menuItemsRef.current.offsetParent.offsetLeft >
        menuItemsRef.current.offsetParent.offsetWidth
    ) {
      setOffset('right');
    } else if (
      menuItemsRef.current &&
      menuItemsRef.current.offsetParent.offsetLeft <
        menuItemsRef.current.offsetParent.offsetWidth
    ) {
      setOffset('left');
    }
  });

  const [itemsToShow, setItemsToShow] = useState(Data);
  const [itemsStack, setItemsStack] = useState([Data]);
  const [move, changeMove] = useState('next');
  const [id, setId] = useState(null);

  const moveToNext = targetItem => {
    if (targetItem.items && targetItem.items.length > 0) {
      const newItems = itemsToShow.find(
        item => item.value === targetItem.value
      );

      if (
        newItems !== undefined &&
        'items' in newItems &&
        newItems.items.length > 0
      ) {
        setItemsToShow(newItems.items);
        setItemsStack([...itemsStack, itemsToShow]);
        changeMove('next');
        setId(
          Math.random()
            .toString(36)
            .substr(2, 9)
        );
      }
    } else if (targetItem.onClick) {
      targetItem.onClick();
    }
  };

  const moveToPrevious = () => {
    const newItemsStack = [...itemsStack];
    const newItemsToShow = newItemsStack.pop();

    if (newItemsToShow !== undefined) {
      setItemsToShow(newItemsToShow);
      setItemsStack(newItemsStack);
      changeMove('prev');
      setId(
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
    }
  };
  const childFactoryCreator = classNames => child =>
    React.cloneElement(child, { classNames });
  return (
    <TransitionGroup
      childFactory={childFactoryCreator(
        move === 'next' ? animation[0] : animation[1]
      )}
    >
      <CSSTransition timeout={300} key={id}>
        <div
          className={`menuItems ${
            showMenuItems ? 'showMenuItems' : 'hideMenuItems'
          }`}
          ref={menuItemsRef}
          onClick={event => {
            event.stopPropagation();
          }}
          style={
            offset === 'right'
              ? {
                  backgroundColor: color,
                  width,
                  color: textColor,
                  right: 0
                }
              : {
                  backgroundColor: color,
                  width,
                  color: textColor,
                  left: 0
                }
          }
        >
          {itemsToShow.map(item => {
            const checkItem = item.value;
            if (checkItem === 'back') {
              return (
                <div
                  className="back"
                  key={Math.random()
                    .toString(36)
                    .substr(2, 9)}
                  onClick={() => moveToPrevious()}
                >
                  <p className="BackArrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="rgba(212, 204, 198, 0.6)"
                    >
                      <path d="M3 12l18-12v24z" />
                    </svg>
                  </p>
                  <p className="backButton">{item.value}</p>
                </div>
              );
            }
            return (
              <MenuItem
                key={Math.random()
                  .toString(36)
                  .substr(2, 9)}
                textColor={textColor}
                item={item}
                moveToNext={moveToNext}
                nextValue={
                  item.hasOwnProperty('items') && item.items.length > 0
                }
              />
            );
          })}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

MenuItems.propTypes = {
  Data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  animation: PropTypes.arrayOf(PropTypes.string).isRequired,
  showMenuItems: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  width: PropTypes.anyOf(PropTypes.number, PropTypes.string).isRequired
};

export default MenuItems;