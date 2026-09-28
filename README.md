<div align=center>
<img alt="I chose wrong backdrop type when I was writing this theme. So picture you see is actually Mica tabbed not Mica" src="https://github.com/user-attachments/assets/2f65dca2-481f-4bc3-9dcd-0f6282cb4e37" />

# Discord Mica
</div>

> **CaelestiaVOID** — a Liquid Glass theme built on this base, in `caelestiavoid.theme.css`. See below. Discord Mica itself by Coolkie is unchanged.

#### Discord Mica focus on brining Mica material and WinUI 3 standard to Discord. Also keeping Discord aesthetic at the same time. Without fancy animations or overwhelming colorful background. Provide just enough customization.

## Requirement
* ![BetterDiscord](https://betterdiscord.app/) or ![Vencord](https://github.com/Vendicated/Vencord) (You should know this one)
* ![MicaForEveryone](https://github.com/MicaForEveryone/MicaForEveryone) (For Mica backdrop)

## Get Started
### For BetterDiscord
1. Add Discord process to MicaForEveryone and set backdrop type to Mica
2. Enable transparency in BetterDiscord settings

### For Vencord
1. Select Mica material at the bottom of Vencord settings **(Transparency option is not required, enabling transparency will make Discord missing window animation)**
2. Restart Discord

That's it :D

## CaelestiaVOID
`caelestiavoid.theme.css` is a Liquid Glass theme built on the Discord Mica base. Install it **instead of** `discord-mica.theme.css`, not alongside it. It is a derivative of [Discord Mica](https://github.com/PL7963/Discord-Mica) by Coolkie, which is still provided unmodified as `discord-mica.theme.css`.

The base window panes stay Mica and the glass is layered onto floating and control surfaces — buttons, popouts, context menus, the composer, inputs, reactions and modals. That is deliberate: **Mica is a matte, tinted material with no transmission, so it cannot refract.** Liquid Glass is faked here with `backdrop-filter: blur() saturate()` plus a specular rim highlight, a light-catching sheen, and soft tinted shadows. The large structural panes (sidebar, message list, member list) are intentionally left as plain Mica — blurring them costs a lot of GPU for no visual gain, and matches the Acrylic advice below.

### Palette
CaelestiaVOID carries the **Caelestia** colour scheme over from the Midnight theme (`caelestia.theme.css`) — warm near-black browns with a peach/rust accent ramp. Midnight's own build is not imported, since it is an opaque theme that would kill the Mica transparency. The palette lives as `--cael-*` variables at the top of `src/caelestiavoid.css`, feeds the glass tokens and Discord's native colour variables, and the theme file's `--dark-*`/`--light-*` variables map onto it. Light mode is a warm-neutral derivation, since Caelestia only defines a dark scheme. The background variables stay transparent so Mica keeps showing — if you want the window itself to carry a warm Caelestia wash, set `--dark-bg` to something like `rgba(56, 28, 18, 0.18)`.

| Variable | Effect |
| --- | --- |
| `--lg-blur-max` | Blur radius. Set to `0px` to keep the tint and specular edges but drop the blur entirely. |
| `--lg-saturation-max` | Saturation boost applied to whatever is behind the glass. |
| `--lg-brightness-max` | Brightness lift, so glass reads as lit rather than muddy. |
| `--lg-tint` / `--lg-tint-strong` | Base glass colour, and the heavier tint used where labels sit on the glass. |
| `--lg-radius` / `-md` / `-lg` / `-pill` | Corner radii for the different surface sizes. |
| `--lg-shadow` / `-sm` / `-hover` | Soft tinted drop shadows. |

There is also a mock of Discord's markup in `preview.html` — open it directly in a browser to sanity-check the glass without launching Discord. It is a development aid and can be deleted.

The theme is served from the `discord-mica.pages.dev` custom domain, which is independent of the repository name — renaming the repo on GitHub will not break the import URLs.

## Note
* You could use any backdrop material, like Acrylic, with a Discord-Mica theme. However, this is not recommended since Acrylic is a transparent material, which blurs the contents behind windows. This can be performance-heavy and cause visibility issues. Acrylic should only be used in small areas.
* Both Mica and Mica Tabbed are tested recommended.
* The screenshot I took above is actually Mica tabbed. I did not realize I was using Mica tabbed when I was writing this theme. And I was trying to replicate Mica look. If you want to get a similar appearance you can use the dark-bg values in the comments
* You may want to add more blur effects with a backdrop filter, but when transparency is enabled, backdrop-filter breaks. I recommend tweaking colors to make elements fit into the wallpaper, instead of using transparent elements without blur.
* CaelestiaVOID relies on that backdrop filter, so **disable BetterDiscord transparency** if you use it. Vencord users should already have transparency off. The blur is gated behind `@supports`, so on a client where it does not work the glass degrades to a tinted surface with specular edges rather than breaking.
* **Mica with WinDynamicWallpaper is AWESOME**

## Customization
You can find all the customizable variables in the :root field of /src/main.css. Below is a list of common variables you may want to use  
`--dark/light-bg` Allows you to tweak transparency of the background for personal preference or accessibility  
`--dark/light-accent` Allows you to tweak accent color of primary button or toggles. You can get current accent color in Windows color settings. And retrieve it with PowerToy color picker.
