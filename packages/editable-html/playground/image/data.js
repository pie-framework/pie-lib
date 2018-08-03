module.exports = {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'div',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'foo'
                  }
                ]
              },

              {
                object: 'inline',
                type: 'image',
                isVoid: true,
                data: {
                  src:
                    'https://img.washingtonpost.com/wp-apps/imrs.php?src=https://img.washingtonpost.com/news/speaking-of-science/wp-content/uploads/sites/36/2015/10/as12-49-7278-1024x1024.jpg&w=1484'
                }
              },

              {
                object: 'text',
                leaves: [
                  {
                    text: 'bar'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'text'
              }
            ]
          }
        ]
      }
    ]
  }
};
