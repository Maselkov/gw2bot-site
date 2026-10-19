function metadata ({ title = '', description = '', robots = '' } = {}) {
  return {
    title,
    meta: [
      {
        key: 'title',
        property: 'og:title',
        content: title
      },
      {
        key: 'description',
        name: 'description',
        property: 'og:description',
        content: description
      },
      ...robots
        ? [{ key: 'robots', name: 'robots', content: robots }]
        : []
    ]
  }
}

export default metadata
