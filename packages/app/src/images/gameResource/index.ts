const itemIconsRequireContext = require.context('./itemIcons', false, /\.png$/);
const itemIcons = new Map();
itemIconsRequireContext.keys().forEach(key => {
  itemIcons.set(
    /[0-9]+(?=\.png$)/.exec(key)?.[0],
    itemIconsRequireContext(key),
  );
});

export {itemIcons};
