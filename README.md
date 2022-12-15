
<p align="center"><img src="logo.svg" height="160"/></p>

<h1 align="center">Save App Token to Secrets</h1>

<p align="center"><strong>
A GitHub App to save or update it's installation token into the secrets of current repo, then we can use the token to replace `secrets.GITHUB_TOKEN` in our workflows.
</strong></p>

## Motivation

The app's installation token can be used to **impersonate** a GitHub App when `secrets.GITHUB_TOKEN`'s limitations are too restrictive and a personal access token is not suitable. [`secrets.GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) has limitations such as [not being able to triggering a new workflow from another workflow](https://github.community/t5/GitHub-Actions/Triggering-a-new-workflow-from-another-workflow/td-p/31676). A workaround is to use a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) from a [personal user/bot account](https://help.github.com/en/github/getting-started-with-github/types-of-github-accounts#personal-user-accounts). However, for organizations, GitHub Apps are [a more appropriate automation solution](https://developer.github.com/apps/differences-between-apps/#machine-vs-bot-accounts).

## Usage

Visit the [installation page](https://github.com/marketplace/save-app-token-to-secrets) and install the GitHub App on your repositories. That's all there is to it ❤️

Two secrets with name `APP_NAME` and `APP_TOKEN` will be created or updated before any workflow run, so we can use the secrets in our workflow.

```yaml
- name: Semantic Release
  uses: cycjimmy/semantic-release-action@v2
  with:
    extra_plugins: |
      @semantic-release/changelog
      @semantic-release/git
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    # use `secrets.APP_TOKEN` to replace `secrets.GITHUB_TOKEN`
    GITHUB_TOKEN: ${{ secrets.APP_TOKEN }}
    # use `${{ secrets.APP_NAME }}` as needed
    GIT_AUTHOR_NAME: ${{ secrets.APP_NAME }}[bot]
    GIT_AUTHOR_EMAIL: ${{ secrets.APP_NAME }}[bot]@users.noreply.github.com
    GIT_COMMITTER_NAME: ${{ secrets.APP_NAME }}[bot]
    GIT_COMMITTER_EMAIL: ${{ secrets.APP_NAME }}[bot]@users.noreply.github.com
```

## Deploy

**This app only be used for demonstration** which was deployed on [Netlify](https://www.netlify.com). Fork the [source code](https://github.com/wow-actions/app-token) and follow the [tutorial](https://probot.github.io/docs/deployment) to deploy your own app with custom permissions, bot name, avatar, etc.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
