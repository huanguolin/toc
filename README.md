# Toc
A toy interpreter implemented with TypeScript's type system (see `type-toc` folder).
> As a comparison, one was also implemented directly in TypeScript(see `ts-toc` folder).

👉 Click [here](https://www.typescriptlang.org/play?#code/PTAEBcE8AcFMFpwHsDGAoEGwBUAWtQBZASW1ABkBLFWAOwGcCAKE7ASiy1AGElpIATpQDmucKCYo2oAEwAGGTPjQBsRrXAAaUAEMANgDdKtULgCuO2sNAAec5eFmke4wAEkZ8HqRIA1gDoUJABbAD5OEFAAJVhoJHpKZAFIAC5TcHBoehSQYUTzACNAkOB7KycXWmBkFH888E4uAHE6WAEdcFgAE1ACyFAu8Hp4ArNaLr0CAzl-AHZ-AFY0NC7YFD0dVVBgpC6zSdAAchrD0ABvNFAr0EpguIFxM9AAMTGAeQKAKzWtF-ev7BIADK4CEVlAAF9QAAzAQhUAAIhqwFetA+3xQ4ARAG5LtdbvdHqAAHJIADqOn6UNh8KRqGAMXo+yxuOuNzuSAe51AxA0bRUsHE1LhwURyOMnQEAslOLxVwJnKJAAVNoxITCRWL6dBVW1ZWyFVyniDgkKNbTkTqBIwBMATSy5ezCdygShLOqaaK6ShgPQ3bRaHrWfiOUbQIDfHQPZrvb7-YHbRG6Prro7gAAqdOOq7pni4BwEQEoQ70G60aCebSWHq4JAGNqIxnMhEQJCgRgEcD4UCqJl6cD+UCAXg3AAB72dAuaHgHEd6fT8fp4COqBwaJqZmgAC84dQNgABuOrtCxqBhHReSgmAAPaQXNl365HkzGC+QG8H+-XS+gADUoEgwY-a4IXfYC2XfAxNjLFAAGZNxPM9aAvaC2AAu9n2gphFB-WQ5AnUAAEY5Fw+BQGQ1Dd3CMC2VgS9nWXQsdyBDwBBoUAaM6cZS3oUFjGEUJN3fV1LBsJizBY2B+PYugulLYxoQbJMGHfNkAH5t0jBg2MvDiZPUugAG0AF1lI-NSVWtWAbEU+hJO06TZNoeSBFAe16BMwCrjU1ytJ00t7SM9yPNUnk+SlVRwBE8BTRsnz7LLJzQAANX0MxYECoL7zU5K9FS2LOL+NEvh+dKMsAtTUXRQEQTBYQbGy1LKNKpr7zSeq0ua5q0lJClIBsQ4i3gXlJWlehDkajqPzSbzIjaOEBBKlqSXJSk+oG8zGDGhbQDSazQBmgQ5sCrrlt6-rUHgITaDG1C00zecBlgUZhHnRc2XokKK3ELd9zZCDnK-LdCLkAA2VC-puOD8NQ6FOQkbEIZsUAABZ4coDdKG-fCOEAgHQC-X9KHI1D3t2rdLpsXlPtCYmYAIABBbi4PWyzrOppdadAN5PE+uChv5cKbAZ8A2eAlY1g2LYdj2A5jnpCqisxU5bxDZ0ngAUVoIw4VoYI6DNT0tR9CV+cFNpgA1rWkB1vWU3lUMiVRe1owtbVdVte1badRVuUU52vWRP1LATYBFM9x0aLojn5YxL7znfVZ1k2DpKCttJHai8BUOozXKG13WNDSC3c6t-PM8dCEbuo2jvfegAhMxKD0Lpo5sd8ABE8t09PTU0d81c70si7zvXe7Zfit2V+8E4l5PU9ANvR4-OhLetgvQDVxergrx1w+rrl3ujqqeKsVvAOeAeCvRH5N7vDupPy7vY+efTDmnpPwBTq7jLHuDdxsR9QAABIzgtHAKiYkOhdY2GeKECETBgHmUgfQI+NUbBtxflaSBptrSHEMrAtgoRdyV2uBHGuHNQHgKwdAi+0cfjjxeC-N+7QP5W1wS-WgWC2GHEmJeWAutcHEKuO9RBwRkHAmPrVd8IjSz310opIyN82RNn7BfbiNU4KHEODfeh0iL76TkgpC+iltD+FMQY5yUQjF+AMoZb+plQDSJQbxGwURtC8GCAUYwlllG-GwC-HhfDYC4NCONO8aQfE0xXO4zxgZT4fjpqoiRijri10STVbRcEEmyNLJo98ala7vjSLuYBdMITaGAbXCERC0CiyYQQKW+wCCyx9D4pWO8q6RxXGrA6nIfE2DVvQp49E0iHG6XNLRbEekCELpCVCpD94cyBGYFANB6D0D6VEQZEBaYjKWSstQo1tC9mZOE2Z7TUwdLISubqK0IG6zSbxehu59LALubACEhkvZrMoAUA4+BVAAEJqm1PFpsepuxGlHHFKFaUbQ2kGnttyG5VJzT+3pD4z2hoiRO2FC7H0VobR2gzpixFTw2rYA5ritFPp6JhwRarUA9dG5dAttoIeJc9Z+0NsAY2YVsHmxzsPDQJKGV8z5eAe02gxXSntHs1ZpYqXct5bC200rwoe0EVpTpBA1WCjifeby2SXIZwUX3TWF92Wr1jkypuFsbBnDKaAWg+w9ChGSVccgOhuI+IvuSjmAAfJ1Lq4LOr0HoDJZMM4yLsvlfRjkGxAgvpK0Apj-DmNXIzI1-lbGBTUrqiVGcRJss1rZXy8UGxRC2mpSxRr82yuWfKmw6afHaHTRbUJE080woFoyX4rKM3Mg7R1U5+1DoTWOj1Pq+bNqlTSJ671a5+y4hBYnSWEKZaWjdvClW3snjIq5bGDFqEsU+2sSYRVsZA4BjNqHY9pL15vHPhegO8Yb1npFbuhxZh6C4APciTwjd6DAE2O0SAdKd1hmZsmqDGc5UHL-a7CytoYOmgABKwD0HAAQH6ww4tRdyglZsNXnKuPM8QwjdRWTPdGst8jDLaENTG3S2a4JGXHu+XaRr9Jq0fXYoKXko1HQcbqe0VGNIxSNc2xdDRO0DpUUalDEqG0HKbfGixra1MZuFltYKzMXFqF+Eqb9uBIrRW0JsodnU5PiFHZyLaE6VqHGZtdGpyw6nbHXU0zdSGiWmm3XbBlvtn30ivcHW9JGvZhjVrRZywX8Vu3NjFnDRJiCrA0JQaElAGxxeAIR20AG9D0HA1cXe2rjWmgpSuDc75A2HAjr2BIrCatHD+ocZrhxfmoF8G1wCtWMs9Y-LVmGAgBv3iG2MQ4mqyNlklNCHQrEnaTzvMM8r4BKuwFQqBC5JC97iF5XN1i0WVBOyzRnOOgEVt1Ziwcz+k33z1Zu3PI7AhNsRem-t+bBAbUspi6J-uRrnulris9xb93rvfKe69qiO3nQfdYslAQJ2mN+TO0tt6OyWubDu4BDhus0ipb1hlrLL33zGESJQfQlAABebRC4xdAIG0NegofbdI7tmbbQDtfYbk3BHoniQXwJ+lzLbQ2UWvp4zl1QP8p89R++XHsAupZ3xLQcnlOafTPXizkrlyuRw6+94FAvgkdltBxdjHHXDfdeV1cbi0UpomsMtr0ApXvb68ZTzrotcreicY6bx30vdLe662bj8duhgO+is713evQpc55NCE3cVQ-3ku-1m3oAgjjHJ09mLGeMvcA2N+xXq2M8YcYIXnQxfI-iEl2G6Puu9tx8+x75lxBE+FvfLwbPLCTAA5i+6hPlfi9JozoPtWhXYDD7VKd00DOg1hpDS6x0gfSzt5T3eLPXQc+0DSN37fvf8-QmnyX9vJ+y+T5P4XS-RfGAN5h275vrFH6j7n2j64l3HzY4-ArnaZ6M+YK6ySjZB6S0BGQZ4FC7CpCMo+4Zz35s6w5P7c7MqPz6p3hvKC5pYfwi4CCD4iLYI0ZxRC7YHE6mqAS1xQEXzB5G6Sor40JjAb5si-4khYIAFJxAFtAgH4HAEQFQFpAUFdD-jlxvbs7u7PCchJ75SMEf4W7Dbf73hk4fzq606rbz5M4Z5b47504qBqEur56ISqClzaHOR17M7viQGCE17wFaqP6zYt7fbiGI6d6AS8hq4uAa6v614L7hpd5WwH6fzi46GmGD7niGGcr95BHeGD4CH9Cz5aB0FGqOHSHyiq5KHuEqGuFpHU5tAaF+FaE8B5GH6k4GGBJryhGlFlyAQWHQExGvYroSzgrSxeYhavojbnYQZEgADSsAkAAA7pyDJNoIpOtlys0tULTPIZFsqMZghj6AVkBiBpSMli6DoPJLMcAPMcAEEMEDsLQMsU8HTJhvmNwPmNaNoMSGYMECcaqNoEZj+tcbgS5DqDQA8QqvhrGJsWorxMVlMS6P6GMpyAxv6HBmsusaFkRv6Eeo6Cek8N9sYg+s8EMWemCa0SHO+lNuzu9OTImkal8VYNoFksjqAUZKxnggJIBDiUSbkqVGZMZoLGyo+pZmEi5BfMUmcOmkCM8QQFmlya8RCMAlJtxFUlWi5P6PptxASUyYBFNP6DEUWqAHTGzNDkIosrKVASJA8viQqVYhpCSVuGxuSR+JdBcR4m0CJKvqKZYCCfQKpglNgBpglJsrmpabQC4rcXSXTEMSEkJpdG8Fhh0JyOaUmsCcpmsraQpA6RWlKfYuTK4l+j+vSeGN6eOi6cQUTmaUCBaZdNaeGc5PaeWhYtGfxi6W6fGSZp6UmUWR5DKVaRIkGVmiGfsmGemvmc2lWTSSWXGXceWV6e2RlDWbQACQIHuAAKq0C+C0BIC9EmDIAaS6DgBpDAJAhVJKms7bIri+n+lJAam4kSLsYUkXx+lNCdBvACDkCdC5k8D4SRnOTcAyA3nRBVleSNmNpwlnp7jALcD4T8lnB3lVLaBslfk-l-kUTmZVlTSHnQBqwACOp5pIEU6aX5D5d5D5Tpsm2ZoZNpb5GkH5v535n5Mg-5oAgF+Fv5hFoFj59mLJRqfpdM4wl5SFBZPA95TFaFE01wz5VpmFNg2FdAuFQFBFRFJFwF5FbqlF7F1wEFNF0Ap5DF15TFKFrFfZxZGFTZWFnuik-FpFIFAFn52lolYFOmk01FRJbJiFSavEkwfpbQAZ1oP5zampwgwpElKlL5KmvFrpQIqxlk3ADGllsA1lzCnINkbiYlbFLlxll0Q5fU8F2wHQKAv67ofANlSQ-gLmyp65BAQI-lgVtlpY1WvWRwZwo2d4tWEIJVbItWmgFV1wtW2INVVwtWTADV8+hwbALVtW34HVRw8A3VhwwAfV6YfVAApH1X1O1qEH1QCn1RuJMezCuEeSeWeReV+RfGNKcLVn1G4jIGtbNeZo5U8npSJT+VEFUpEgQH6TBXBUgBFKtUaocLNa1dNdtbtRMjWkSXiXxL-EdYJcAqddUujgtdAHRV0DYHdVSQAGQTJ3lrVQ37W7k1SHV4XHV-VnXzUXUyXDng1lqHD+rQ07X3V43w0fV7nfXI2-VnD-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-O5RJya97O-5fe-Y3Vw9DQfXnxZ+a3-8p7aH0oEScKmgRSdfT3qaAAElob6VBWAqAIipdpe+4AV3r7l-bRR-2a7FlBuydZb806ElKSkSX97wD06nkHvibHABECd2RfYupFXoIi0M4CXB2vmlQJAhqBjA2gYkQkIMCSBv-ZXt70gGsDMBdqHAe2hoFWYl+lXBgGYGgCEhugitDoBUUyrT8gQL8LroZDn4RZ3ozArgZAMEg0IdBQnD8NFxf44d-WI8cDioKMZhtlC57TwnkjIHipUBVgtwhGwwHGCS0F8dNMQErQdlvBguZXvWhX5eDEoD5dwQYE9qIDyB-AsBCKH3w755SYQ3RjyEsQ5dt6J0KdHwIMEldFo2gkATEJCBxDe8CQ8Lu2mIa5D7QzwWIYUU-i3trg9DaIYPjCFxdc274WuIlHX6pQRiW4YFhYJfiaFe8uCYAfYPAEqARIfQ6oawnoypdei7aTwezR8E21uAQdfKCMMRzcVEKIQpiokLAGZC8hlQgoRMNoBtRihMwzWG4k2FtCkhSwvaGAFmh2ZZ0ZvU6OUIzj7CrihwwaB3xUDZDmSzw00K8MKGfxjhggsIdoCJ6MpEo7dLQbsIqFVCe8gIkZrUM-76C8hjQkoealf6CdB83AdoZJxLa3NWhOIokoL26EuoI0PIZBGTzBoQiL4vjewQ4JlSFpLB1RNwWiPCFzCEotcBYcWU5H+CkBgQxtOmjaGhDWREQlyC-GfBhENAgwiIrlxcqRDxUz2MYVYJQCSjwALI04WyMkyaZvB7A0gX4NrSfC1hQQ7UZsNC4ijdRd4eUdKGiH-DDhJw-tJcItEl1khNwyZGOh4EOYnh0Il4bCP8JWw2oHwlURUW+Eplfh+Qt4XCKtj2izh4IpITyNSEPD8uhwMMbaMjFHCRm8AGIiGIzpL8cyQolyF8zCG6c3OGAzziEg-oyFF+fA33roIPKJEaxhg+8CYI85mCNAg+c+PWMKgxxoWnuFuIIPbRkiLYJfLxP0hjGWCFcXCfpkEimEwJ2RDYMIfYKaEYiNOzpXMdxURLTDABiY1ka6LuGyjFoSY5gQ2PSprkoRSAygYiJMplpKB4+dEaYN35tjwOqwpUf0NuxTDZhWoielyMtE8BlhukVYTmUQoPktxNtVPpSNTo0iyeOwvkYyPFHH5b804tgSmUsEbcT80op-twLlH0j1UsEurDfirwbR3x0AiKqGxgmmgcywLXAUJmuEJjjKh45XpQJPEJsOO+aFAc4TfbRRPCZBIwTuOXFPt3w86cAD6lxEb8OYJIsNBYKjR6IOSnhExGYl5oGYuJOaJgcrzYmmg5SD-YESKPMwGYXOa4lfoJNN6x8bARY09iWKIkPjhYkI+-qpLgHID1S74KICEMcmKS4i3Eq4CPTvBOTeR5A-kSpnTSmjNM2w3wbZJDyFpe05xVkYe1rpOT4YtE5iWePIH-89BuIlEfxz4ktCXC1gm1nBEsGKFw2GuRtgZxCguCPCMo4YYaIpjZSI21Aucc5DViJR8OhI68YaMAmaZApCUECc1DUhkh2g0Ab-n0k2FDjqusSftOOM4SGR-ERzRCUlDwFNRC47Q+KZLXolIDv+2Yq4GkF6mcsBp0mGwJROGmLtRxhfMUY-QmlTTTmM0pnOWJppbT+pmwe0INI6GwBN+swhTtv3vFv88OKksicv0bRDTiJxlC2HFNuFTJNBNkpASDnYmj0cOEAxsXeGbHA5WxcMpRLzEqkoTwcjWL+EhOuCeSUZBoiGb9nWHtTgJAM3gT9JzL-TwhpHYGW6Lsz1EwUHmRJmMU2KLFIAGvT9DBQz5NMymVsVpgvwIBrMrAXYexkaksCQADSjjKaULNwACIRCZWbsoLAvhiyFE68ehPpFTQVk1YTuWVhxyVB8BFZos2gOLLJJbhCSZadWfJMdLATPkakJ4KzPCTn9JgRhdeOqDSCBh6wkbY1vzPnhwhoABsoksrKmE70iS83ZyIDFxnXAzZcUC2f4CYAOVDZxstgHJP8CZETJoQPjB5GrRCZwCYMlcLHDbi+ybA+keSixWghTCZAN-RNhCyyouAaA-sstIHKlQXxQ5Ecq4FHNjSppU52jFNKYjjm80lZRsoyGwAzl9ts52sz+hKlrkEAyYU8ouXIG0AlztAZc7QEjErk2Fq5BRRCB0EFj4QB5xsgkgTQDmDyTZoAGOXTHkoayZA48r2WVlTnkBm5DzUXC7ITlwQxZBJPeXqVPkmyBJdAYQMLMVIXxyAzpOmCI1SLfM2UFdHsqrLXnTZ3o3ecADoGMA2l25ukRuc-KPmQAhimSfSKHO-mARBZf88shaTkDOlKeQma5hvAcT6zFSL8DDMGLJLPMoJsmWkSmXgWIKGAaCQuYqTZRrz3o4ANhUgt3lbgBFHC4udoFLlTDoI1kvOSIvoA7VhFVsBBUgqLnuyn5ocpeVMNUUCARYcTZFozNRbeZCUimdDJhjhSBtjeI-aTOcROgW81KVvHJuimkwu8DGtABkhuKCwOKfQ4JRMOiWhL3puyXMhYgdCWKapje9OEPglmewVNmY9fYTBZCb5qUHeCWGJTFhMVYYXedk7QN9jUm-ArOsMrJb2IMEFKUCDY4pU3BvGYDv+utYPp4tywJYw+tvJ4Mg2JwCtT6uAdRnQCoCRgklPmeYnzPlkiYM4A-Ifib12nPJFMk-afrPwojz8BlFkPyWGT-Eo4e44YHUjYn36W9dpTwcPA7J7AGYdokIGBd7MUxiY6AhBfKHRlbmgFzlukDlm0tOW0AullkQ4K1jEqCltMHZZmP-17S11OMRJO5QlQeVPK+oxVN5QpO4iijmYOS8Uh8uHTXKL4AKkzIpGBVGNoQY0VCrpIS5mRdQF4n5Rl3hVGpEVQKygJGD6hf4wVjpTFTwNebMxUCeK6lX-nEwIr5axK0lYcDkIUqK0VK6lRxTiWMBohMKsQZLRSXHZC0rMTVBRgsgCqOM1GNZWAX044y4IfystESuRUkrnlzVTlRYm5Ux1e0zK+5WqrZX1UtVWmJ8nytgA2jfR8QiKd4RimuT-lLKw1c8teUYqIVIpWlQYNeFWsbBfSL5fdPCm6SkhHqvYSKG9U2tfVuoSGZAJ+UucJlh9I7D8ERBMAWwqxV1sNlAAuMbGXQIhrnIIDBqYRIQMNRGz6TeCrl+ookopjakJQi1GuV1bCuLL5qfRBwtMTCob6lS2gtdbwTTL3G5rzVlq5tX6L46ARlVcUOjCEWqllSMJc+YIuBxHX5RVVZ6FFcarrVMlsVUqz1aGpKKlxW1JUrIrWttWrsRVw5VmHVN-HOlrhCmSNYTONET1DhK6kUnqsJWOrF16qvqMutYo6r2Ka6-lRusLVbq9YO6mtU-IBFWwhVaQONZgwTV9ccQKa6EGmthivirY19VhSkJBnuigonovqI2r+FWqBhoSGmthvDHlFt1MqplXa11IKr7wQG9zsnjOwzrAIIGvvDDMiI9Dipc625c+o0gor2qJq+lfYkI2vDxaBmNtXuuA13qD10pc1YqJPWfiGwOo3wUsqk3XqBR2o-9W2I-VurZMj6h1QapfVsqeN96hAX2t-XBAhNEpXdQVLE1piG+QY0uGBvNX9941tERNQiDYCwb4NzkCURUWQ1wq-BS0yTUmIE2brbNesJiR3UrF5rdQ-a0zQ5OHWyryNNicde2po1SE6NkzBjYcOAGetx1IW-VjKOy2tDLEW4E5azDJE8jL18y2DETI5FQFDN-GwZeRP0YoEDBVU5LW4nE3EaR4jKKAmFU-XOjOR3a0GRlUlX8qGxl49jaWDHWzr4tOmwFaFywSYEpuT895aur7VjBpEgq09UqG-EO1tt+qubZpl0S1oTGAgFWStofX2qVVnGzpa+sOCgq6tElb9bAGhU-LT1nIi0fkkU2VrqtDYGIrALCkrLztPK3ld9pX5a96BkAt5LcXYL0AslPWnSZpuB1e14xaG+4R6MeFYaotDY+AFCrsnrT5pDiVDbTP3EE6INgZXcFBvEB3bTgvdYbAQEfCYgAi1RVjmkMnROYsdEO8ADjo53SJ8d4GhreACHaU6YQYwRnVbCdRYJtAowcQMIBurT9rI+kOQJNOOATF1BMygjTzph3jaZttGM9O5NAD0IJtEHXTVxtu2aqHtP47TVdpN03b9N6KjTfWszmnyVZqaXtCPOMq0r1tMO3gKoE22ybnI2291YpqJXpojthAk7WdvBWO6tNl2uKAutN127eNfWrCfpGkTJy3dFo-nZVon6UdhdbVCZNLpPBy6gElNAzIruV1qCt6JEwnbuKG1wrAtmu9oKIm51SqvdTe+gD7qLqHqBdQu5zX10ODNUpdngIvQuRL0K6ldqg1XRoM-qe7aA0iTvdrrI2VsKNeBGHYtuFykFPk+pSjQbqVU6649LK0PevpILLao9q2q3Qfpt2PLbt1VJPYjobWN6kEC+m1QrLT0OI5pkm1PXSTf1KgxKrugzO7o2kOahluevveIEAIS6zmvQYfbLtH3AJx9FeqferuG0cxmYF40jWcrlX67Dd+++ddduv1srzdDu1bUer91Ek20O2+xGrC+1XrjsP228uJqB0dRq0sevA1fu4326mDj24A9Gt0mnr18lB7gwIYvig6VN1a+CQRNQ5cGeVLBzNLNqRV6bnlG3Tg2fqdH1bs9EUV7f7vXiT4gQghpHaQInyMA9DIhgXVWobBGGp8CEi3QYd21mGmt5SjvJAMY1SoJDxeNlPhOLy9b79thyTZYZMP+bfDXtBvRZEoEt7jDGceAMoaFUPDRDijNvE4duoda3DjAbQFdIR3R70dwhwI-gIx3s7QjiR8I7AHtDwB+s9msncOVGRgHEQbm3QHBobAZZM8hwnzVZmoO170Ny09IfkcYBhGj1fOng4Lqc1wBoNya3oGm1k6NHENtAHNSgZXC46AdEUDA5pAS3yrB8fuWjaaE-nYG99S+82Wj0AM0qe9QxlzRCBbAF01QnWI3PIM6ClwWjzJI3fHtt3PLyqd+zIzHTiNhlsldk0zEMG8NvHmS8xmghnDlIlbqMb9KNNIsi0WQclmtOMusdS2bG8FRpGgxofMPORBBbZZ0oCbd7RrIFPx2HS5A-2RUogg2jo3wqZi6hoV+kGFsVTub3bMBmlbmvCxeNuK8Evav1XkIeU3LJteupE-eAeOH72pmwDAsdqW2PFpDfbVgxxvYO3b31Epm2h8fUrMp-+COKHbaoyNJCL9bBwFU6r6izVXjQqp7YqK0MVraDRosQxYdog2GsJWp6UzqcUNvqVDlKnw9Sqe0LKlTvOf1ZANVOS6Pe0AP4zEY91HHIN1RmDXUddbgx8pNgrVA1k-h3Hq9FRzHRZFACRmJ1DYB7BDhMBzZG4S7fHbEeDOBkqjwx8QGGdhgIgNw7mhsODAVzxmgzGh6WsLurNYIZjp41A2adExG6x1nDYrWaa5OAsCqH4FE4wASUWn6pA+Yg86VtOlhHjBB55XKdUOyZFTPFc1rDP6QxYAzVFRM0WZc3YhKz2HAUJmdrOLQST7RumbooaL6LFedSnzM9nZlhgPFBsS9KiXCzh8iQkfWpeSwyq4tml2WWpY7z6Vd8N5z2Loe1i9Q8cro7WYQHCGkF9UYkmwNme1jGDwW+qLgSUPoD6r0cdAY7Pqm6DDQY9b+HOAQPHnt7KsVswF2mNYRNZEWW8VANC3oHt75bSLFuVCzZT0CTFfoIzU-qJLgCUXRC7Tb7LRdYvSanpmjQBYkCEv05lWx-fZvG3C1Vy5WpreHHVywuTAGLzG5yExbgAjJML2FjPMwR-Oeyt4cs2wopeQKemhAKlwdjFhFnh6xTFpEdpZZIvy4sEO0Xi4gXlYKkiug5enIxffCXYwLfndi9cD+hvJGVdADPEIFECj7nsblky9Rbmae5fOvHRUcHOvEnaxcMoi0kle8s6EpLwplyySAisiAxAhcWK7Hg8tNBoLUFHy+pbx4RaRkUFjwNACCsIFYzueFQGVYUvxWzLXQSq01cVH-Z1LFpPq9IKcuAQMzmM0q7JZ1nu5a4xgeC2pY86SW-LFuOC8kBaugBJgcG4wpqy3KcgwrtAIq1FZ2vTX2Os1z3HNY4TJBFR98mUdoD9JyriaS1lQBaUusLXlrgELa6PvIC7WUq+1zmNACOslXognVwi-Hm4D6B6LNV56xpZWtaWjguFtixoUhuwArmeed8JsEcClwQCz2HObz2MvlXTLmAiG2GkVEk3JgFbGGwSQEDCBuTfp07QwqJLk2xrH4RG6jb3wo2NsGNmm5cT1ggE6YNN+gKDfdxjl3rOhXy+bnhuHAkL61360FU1yKQy8GMz+Cdfxv884r8eb7KLeuvWWHrKxjK0NYvja3IALN+8MlXluYdAbYOA85Na1zCF6ZCTAxYhkJTzE7zRIDyh0vPS1LvFaJDSGyzPQjEo+cAH4u9D9KnlseXQUbsB0vDrAzAqwB5Zv3ubP1Wqk3DfWYtqxo9vhOskmA6acZEkw7AgCO6N0DTmQ0iDy-sxxkgrh2eiWa5Zs6Wdr5lsAvy0ww8Gtbl2RSvsCGuGCopaLALd-Rfidp2NPH7USgibidtODX8+7HHVVU9dHW8m1Z+ZV3drIdsK9micxRpkBh5lXRA22djmNcwrK1wrlKC0sAUgdpMBUkRqBJD43T7+N9AjAbGMZUp5T2sSXzRu7c3nhpsq88mbZmJPDC0xDdRiDmGpDIBpAS+X9suCvcvNr2NiG95pjVDdvcgCFXYSBYEuAzBKwMz9xZLgAyz8Kq69DABgOehllpQGt5c2ow3gaidF6Tup4AlUZ48Ajk+yzhqC0lq92Cb-dvNYnTwf91vaJNRGmTWXKfk0a6tjedVCQcmZ8HVDOmOAwbnHzSSVy+hiQ54f80aoHDRTZ9SocO1RHv84WQnQTJSOqwRsok4tDEeCxU6xDAtGeW0e-pI0lj6WX1HwgyBoIYWthxx2qh1NLij-MtCaXdq5STaoXB+ZfSqSvMBcbs2AB7IrHyWOO3jvWt9GAShyhHBF96BE1x6HA5AG1I4PhHSeHAZAWTpx61SRhZOFgWT4GFk9mBZOAAHFk4ACckxWBYsl5IwMNEPtMwERHkBZOfa292rD7TVGzLu+0TRp4Q5h6HAdAWTgoFk+LCtUugWToJK1TRWtVhAWTmWSnayefAsn3WVqmxdarBA+qnTo4EgCyfNXWq0FLJ20VqyjRWqao1qmYCycGAsnvRLJ5eCydszWqVOPqnTCye1wsn3ALJ23Cydqwsn6PVqk0CyeoYsnxALJwACksnnRLJ+QCyeEA+qxILJ28CydKgsnAARSydRAsnQILJ9gCycjksniULJ2SCycAANLJwAE0snAALT6oAB9fC5E5JhCBggIITYDu24evF9akucXmTAaeqh5Hfj0OkzfYbkPOGlD62sWTT63B2XDwFxOgzl56L2u0Dn25dFaTmL70oyvsL8AP7SYCWTi0JfegfMxgX0KTHxX7cwdq1LAwy0TvQm1fMg9w+kDBpyCn4l7pl7dOp9a5FrcU87uujSLPf-qk0yYmynVyPdnJ0AdoDD7iKcknuuYkWF5lV0kyV5ICzYZHFluMk1cFNLFOrg1zq-6Xd903FHeuoPztc1sc3jr55EW8mXuuNBkDpN2i2V5mwpWCDslHiNJYfno+VrhiJ+wdYTxT5LjNIJ9TdeR9u3EHaANu0vGlvK2vbrlu+E6Kvt7wzUuKFJzJFvBggiQTdp234hd2ng+kfNsYA8YjuzkE87dnBBs4RQ7ZaQBYJCDuYjPtAlPUIC-BGfXzmJXrggEhz1Tvhp3uu2d3m0Xe77m2+719xx3ABitDOorPVFe+8K3ujgYzo5WVhbbGdv3cnTlv+9E5kiF3zjHom4yICvMXmt9wJjTXACttz3RnG0tB6qdS7CPqRzPG7JdSOphnLmet55mTcwPM+2fagK2-DCsu5X+sU1-SE+ItMx3ojZ4HfZZhXK-XcUSnp63nxjAaONXefLhFqx718PTC0rlJ6Dc1QO7vHhBfK6btrVVPDtFhS5Ro8WcrMT94j6J-E9CLyRYnyfDYDkCQmIA1nyfPIrs-ie+oYWvha58YCwQtwvnyyFdPMeBekYvMegPZ8YA2B5PI07oM54oERfxPN7gL4l4c+nAjg8XwL8DHC+RfnloAXCN545gJfcvswHL558fcifNYnBCT2V4c9N2RPFI1KFZHoSBfmvkE3KGpBk9M8QvjX6eeSLT5NenPSrxN6x8bepv2+BMr4Vm8-R69alA3CpsilsXyp7Fj55EDbwCyfpsrsSt6zrZUBuJIbsS2JSNeqt7eKA4l9oFDdO-G3YlDlsdvbwiU3nO+fiwLIoZ6Uu2N7-tucjlh9svnGloBTfu+dW+dcu3z3jmdBSKZrF4+sDre7Xyq8WQpUvX1B5x9z7J8wwdMLoF0G0BtxKAx048toGPKodzy2gc8qh0IC7BuW+wC3gUFQcn1cAwAObNxB5TjAaIefe9AXyL7ZWi+w4wMEX1ARl9BOLfcgZiyRmw+kBOShvuTOb6V8m3E33ycSlR9Ehq3UyUYtCnG8MhyuGblbpV8m-mmVMEnIke29Q4Iz8oZY3KaG8ddH9OLSUM-mxE1iX9DlET9eew+wmCgBrwAovs0Pf6DO72Ylui89lXGtTuKasF+NJdLGkzJag1stMd-9+yZnxwfq7DbbfHYzWjRtq6ybZixYr14Fza79ZcoVdT2KMyI1Dt-T8qAPtWf-QMX4GvJ-06hfg3xZbu8Z+DDakNWBc1u+qXc-1fhlegrLRbfG-QR5vxc17+jC8-4fgw7X7LTM2+-QR3lS3-0CT-h-nfoI+Eg1-FvydY5CclOSY2J-xdK2YBPH8r3IHWzXSC5vP+HJ9wL4p-28e9JbGWSsR7QgL5VPj9s2Zp+f+hNiJ8kKjlN-k9mpzZJlUyHa5NqjZ0CV8JiDnqnNowjxMs8F-AYI7BAQSTiVjuhIecz7jzbY28AdLJFSHUJECAA0HKAARumAAm-GAAp8qAAFK6AApuaAA9KaAAgMaAAv4qAADqaAAIW6AASAmAASvqAAwDFEBgADD-gAGLygAPRmgAFjygABvKdAYAAvZoACd2oADIZoABfioAANzoABY-yMRIKCCulhQBNwNGjyoOPhhj9AqwLEC6A4wKABxA3yL8j9AckIoSwA-gEMCYQCwOU5VOD9s1CRAXaDHAC2tNoCB2ogAbAAQBq6FAFcIgBHAHviyAVjZ82YfsdIF8I9vpC+AZYKAAUIYwG8hg0nNunIc2YaEAGOorgbQpIywSCFyaYasGrA7CDgYLbOBG7MkGvwkAQMLK63gcASlifgbzYaAo0BZJlKWAgYD2oSQeAF1YqQXgjpBnUlkFGamQf4I5BTgUgAWwaJjwAo2AgP2jpojsEEBwA+fkZqsS3xgUFMIngcrrMiyuuHjVBuvAwTjBg7B4LaG72k36MoimvpKjm4In-6BmZMnL6NaYOpsKABwwR4KRAtAdUSAA5kaAAMhGAAMdqAAgZGAAe2qAADEqXBFsGoaLQKOsTq-BwRl0az+egKf4fCYvnjrHBXtF0E5GBOkmIghYIbyA9BYiBbB5mxlEr6YMjgZUFDAm1lY5N02DPLR6BsAcARHmzJBiHk6rgdsDfo4gL3Tn0hwIbxD6MusXpLkXzK4FsoMdjlDx2q7pfAKwVklXrGU2IqSZo6CUjZLIheQfUFSIa+isb66bII4F02uNjvpsg3wXeI3+n0sjLXAYwclTG+ukJ5xkiYeubKh6u8isbAqQyBbip2J+iNjX8ycu8r6hc9hRoHGwUHKHSSmmOfLu+PcmmhR6ToTKJGQDofYjPi58vt4JBVwZqLkGh2o1JGaSoMu4rCgfjeoNgHUmAxDBkwVhIHSI4pqETBMYkqD4Q50oEgYC1ItoZphGwQYCAh5UGsFahKoYjKWSgIcFBIhPwHKHihMKm-q9ocoYGGTAwYasEi06wUmHA6acKWHphWbLCHV69EmKF9BmsPAAphgYGiFWYkYaeYk6eXF0Y1hmIHWEjhBgOCHkCt5pqYr+0tKSCgAvRJSCmAbQKhyAEpYNWC6AgtlSGMwODL+j-IsANNSdqtAMOH9B3FMqHHSBYaUKWM94bWG5By4TmRd4iYeWEm+SMu2K9hhYZ76PixUnq5huNDn+EGA8Qa2H9oj4K6BlhMEQVCIRfYQ769qIIUP5n+gEJH5xQWEVf6gR6oVcDeSD-jr79IL8JFZiAgQaEj0I3kvjJrhX-s2TEyTFF2GvMt0tlaDSHPl5ZHSbKCH75W-CMrpTiuYUY5e0sUjOE3SfUhxG7SUYbpDchr0ulIfSgnAH46+FMov6LQQMuJGzGCrK37KWDfqMLn+qUvVz18CkaqGYi74Pf5b8N7P2jx+E4oJHTSwSGSIyRpYFJwVSKkdxSUyLnIlBChJOjTQghOfvpE4RqfmLa4EJkRWFqhzrNWwrGXQuvC6ce1ueyT6cAGByFsqMmRHx+E1kn5USxUnrZUkKPA7RORLvoLqMRNpAFL6ARwcpEMRdBivy8gHslF7ZQx7KP7GUi0qjqzhGdOSHDkVHOOSTk05KAAy2-QOba2U0-H6TT6a5L5EXMlftZYGRRJONF7eoUQBG3+qnJFHL6dANFHx+-UUkBcIagqsxFaBUQNZTScGtRGD4UQMVbiA+WsBwURx0RgKRAgALBygAL8BgAC9ugAKXGgAEI2gADwK0QMdHaAgAAdqgAFxyoAHDwM4gaIACQ5oAC37oAD3sXQGAAEqaAAOeaAAQAxNsAknsExhBweQDxh9Ug1Ex02UTjRg8WTlDxGeM-hcwwUFgKha9QfpMT6bCz4kdFRW1AmpGS0mMXFCHAcPFk6I8eMTHQgh5AEgA58INLJSkxFAJsKUxYgDTEPCIIb2jTRw5DzEoxEvhVHDk-MX2glogsRnTkAJ5ktKjR+gOzGcx4wLJQLRsNFDStUzMasz5Rq7o5LHR7vrNE6hSMuBx0x+UAzHw8TAr17fMeYUSQmeJwZ-6jCMsfLFAGAEtxQSxmUcZSWxukLjRI8vgnbEox5nNBJSxOZN7GsRkmhTEfRPsRhplczLKv7tRbMRzHUAXMc5DZmXrL0T4AJgLrCCgg0dADDRzEirH0W0FETGJAvUFrH3U2MU9R7UAkgbGG+h0a4imxg8IBGuiV0YAAA6S8FcB3Ad9GAAYXKAAAHKAAL4HsBgAIU2gAN3KgAJHG4HFECIxbkbGEWIqMXHE-ifsTkjYx5US7G6+YZNczexTkm-RfM1kUjIiRzoqvGQ80PCFLzxjaNVHVe-SNBT2x5mBCL1R--nCptRe4CCGExlOFAAwgiClnE5x2wKjZwGZwENErskmrPHeRvaqIw50NpMSBGhvDrxDnEh8so6PIrGDAkIJIHloL0AK9NaAmSsCWWjqKJIIglxQLcignyUxIFfLEMwsQZiixl4qfHLM+sSJb4igELPEERGUl1rXRXcT3H9xw8WPFTxM8XPHhx9BtEBLxrEWpCnxhwA9wdk+kLvGJQnyLWiYJj8tgmhc8lKFwVyIpLdLF+fSOj6g0qCQQlPxSQlIl8xMiYLj0AUCZeQ6JKiYaagA6ifNbJAo-K8ikUZCURRRxpXK-GHACIN+Atga0bDBWwegP0BMgMgt7CQEXYKAD9RugZQCUM6iLDChypIc6IGJD8bImEC8iZfTFRQUsolBSqibJgghdyiZg8xOiWQnuxZIZuG56FzCLE2JJfhnE-xxPmmziAsMDLEqB+IefShyaQF9YpAe-tpDtAmINFQhxjqJRELkbSaCDzYgxvXSzxsCCAnohSsc1EYRFzNkk0Ji0f67LRjCUYK4JRCQomNChCflDqKLcVvzhRFsXMn0xT3A7TWJafn0hLIBQDgkIJeiauxiJb3B2RHJ8Fn0iEA+wOcm6JBSZbZrUL3LJh3JtibtLY+9QXkkVyBSSfF7JVsR9xGaXyZAAPJuwM8lkJlydXpiJX3DwI9SfUhom7S55NCkApy8XCnAp-sZNTFhVicillJfSMeTopsKUjpvJ91DYDnxSOkimcsKKWG4k+JKYCmmeANmtRA8LMenQ0p0AHSmOuBPoymYpS-gnEDskghv7dRa1n1FxRBcUXFyWHHOCmcRW-IRFXKDcdxbmeTup7Er8HkeQrtJgydFQQiEqnvZapnSVnQDIH-N35xQTwHuJpA6aD+7a0jdMw4O0hAD6QHx2gKLy8u4zBLw+AkwDLwwegaDF60cOigm4MyDboYpmwR6mkpmKS2BYpzQpvIt4uQ5vioj68a3tJhG8xrsiQJpyTNegWudAMmkMoEdgSaA+moGMRdcCvtyABKaaevaZ8rMtmmfosfCr6Ce0PonysIRrgUzjm2SmUnbenuP5GPEAlud76A7acyjR+LaZ7ht+Vlqd7DpfaU3D4RxNgd7hKf5pEpPer5tyAGWrSglSe2TyrWnxYvShvZMuTvrrJmmtrnAlWA9rhW79gTrkeo1uwCB669OG8keo5kimrEqaeciPPZm+dilsoxmuyr2Cj6ZAHG7COzvqQadmT6T2YWQ2Vn2aO+I2rADAZ-6Svrdm5qmrHUAslKzBXKQ5iOlbxKSQlBrMcGtabvGuoNlZyk6Gb8B8a8cRMkAhM+thleWuGdUluhkGesqAMApjKZsq+pphmHGQGdxEmmZaDemCJbsROYdkeGcWz1+7fqX6Lm7Zg4ZdAWEd8zVJ7CBNLmYx0RuYpkZ6ZRzVRlOD0ABWvHAGx6ep4IAl4ZCUdOIQg-IfHFyZ9dLuDMwPYMbG4eymSYA6WBwJnHT8vaOXrZhAkbpkAmQmQZLVJntjZB6pcxrqCwZKAPBm4Gj6VBnbRzMF5kg0fZohkt2w5kVGXkeGYxm6YnmanHeZAgORkYZpqtTIa6FkF5mnkiWSdHqWrmVgZ8md4LRkHaCULQkOmAcU6ZcqLpuoaMAQWfRSsZcUOxkLx70VTFcZzBjBlxZGWeqStpafjdYuZANlJlRWMmXCr6Z5OkZnI+E4JyC5guHr0nfxjcNZll6E+twj2RaurXT1ZjaFFnXKvCm2ZpZcWcFlUZqxtBkxKZcZ-G9QCGSalIZI5t-5oZPWfKZYZW2erFe46pGtkEZktCSapZVWdtnjAmWZRm+ZPJhRqSe32cbqFZDYMVkJ6zyozEGmWJpGqHZxMWQZsZTmQcGcZ12U7qBZ72fdmCEy5syjUJa2TzEyxA2VOF7plHCNlxZE4NWATZ7jFNlWZJejZnzZQkUtlCYK2SphrZ4quyaQ55cVABcmuWftSAZjADEAbARQidne+1wGdkRZ6aGtmI5MWfEpQ5FcZlkamKWSRkS5rOZACfZd1gSpLR8qn9m7Gl+oDnOQwOcPYPUj1LVi4x4OZ8q6gPOVAEw5dWXDkXZFaLHFi5lWYOyS5UAHKSdZwUWJlJZ2OdJky5smfjkGZRmbAAO5fUWTnGxFOX9RzZdkRdK4IDmZJr05YZIzlgm7mVCbc5GGGbm7ZKsgFnYZGPuTj1gIWadlhZyGQMGi5C5gqYm5Seb3jS5yWQ8IvZcuYnm85n8ErnZZKufMlq5JqQVkmY6aDrmzmfUJNStUfUK1Rsp3eQxnNZD+kBkZ5H8Fnm1Z+UNHmoZ1uU1m25N2dXlQBTuRdZtp1lljlcsjWWIC45pOt7nDZuoHso154upNlB5P8bNncQtmQtnh5tOfmbxKEWbHniYG2R5nD5-hFnkp5UwmnlSqgyYGT85jkrnnnZTEZdlJZs+UxmMAWiZnnPaD2T1lPZoCcQzMwIBaPlgFaOTxnK5L+ermYGT6vcpt52KT9m65XVK1S9URuUXnv5mIIGTj5ukJPmXkCOYXndS5qrAXqBi+RjnL5owqvl9ZG+Z7mDZ2+e1FGZc7E-kEAh+VFbTZegCfngAZ+TTmR5dZuFmVRq2T1lM5WkX2of5x6v9ldmb+YwDG22eQLnERP+cLmaYBec6b-G4ufypyFZeZAXoh0BVFoGF4BXBpfZGuRcoAZSxnTYh6mmO3koqQ1K1QDUrVKNT4FQ+coVp+5uRPmW5f+dPkCxg+U1BPaYnkQUJZHWUvldZK+T1nu5-WawV451+SoBDsRmQdhJAISYHl8FweaXqn51OYtmiFi0GQW35ZymvKvZsACoXIFzef9n2FRWZgWgEKKreHRZIOrqAqFJBaWBkFbaOOaAFehXnnCZnaTYA8xgOPEVb5iRcMEE5zRWn7E64Zg2DAIfpPpAIgU4giCX5pXMzDk2IGRFilFqxS-luIShbABKgrLvBaqFXeELkSFVubeS-+QRZKZyG1uvaYg5fUEQZdFvKlOYA5ChrcX56HhV+rmqqxS-p+FHpl0Cn+MQQkGocbGBqblG2GYLY+FukOmh0w+hrJjQlueXKEDBzYRcWIpWmPtovFuuQZrIlwOk9pfFwmkponFnxp7j-FbIQqSC2AZlCFR57BQVyhmtRqmoNgiNjEnMpcJQOH16XRisWQ2RRnKGThzJDRJgAedHFRtKHmFsAD6qnnvhEZPajIUwFgtrenACKsg+lYFTeSG4vpkEaeG0276Yw5fpznlKW027OdKFTCXoepZbGeWWyB-pYJqep0wHQTbQWlGhQSVT5zkI4GNFuqlKbTm+Biiq36jpUjlglOpS-oekgttTZ8QoJUBnSl3FArJIljgZvkPC1pSyVAGIRsAWC2RRuuGgZm2YwB7FtwAcUVFahQ3ma5reRkGPWSlPhwXwpoVLahyEyNJaWp7UgE5updqQQXiFKGejlNwglhd6KiEIoZQpkuEflBFlJeEpzwO2gFOLllCUPlGi81ZVQVkF3aX77WWLZeJTMp7ZbpCdl-Zb9oXwLjLh65pkIGX6jlnuI2W9p1loCDHCh9h7SZ6pqSsInaeKeuXKmukfxnDkAyK2Vkph5X5m65mqlWFNFIxQq42ldZemhNAqFE0AUlgdE0BolrKs8qYlDxdiX4ldZd9gDpowl+VDF0-s6JDZ7Ucd4NJl4UcDtULOtBUZ0sFXuBGZ8FelHi6mcShUCp6FR1EipM5MiS7+ZwPv5T6vZdNLT88fiIVjJemVSWGZuoKmVy0yQPwWH+IoSuA7lCIlh5EkS5e4y5p+-F8wR2bUDyzQAvEM65CV2gHxVocWaiJWcsYlYelTCUnPfkEAwlSMyiVvEI6x+WZPN15c84nmZ56WtPN4SbYw3oGmje-6LA60+9Pl6jgATPqsCPOgbNNgHEGPuunseTTFZUM+tlVwW1O7OMaBmA1PmWluVQGB5U2VvoP5U+VDKI8lesgVZsQhVjPsED7AEVZ+i-JrlbFUdAdPp5XAA2+Lc5XpRIGT49AMVZZXpV1lfFW7ASVWGBE+FAJ0D4+vwAT6pVRVV2AlVtldsRWgQSKZWO2V5mlWNVmVd5U72bIBmBZg94LmCAAd26AAskqAAV8qUBgAMbWgAC6mNAYAAL8YADp3nDFDVr0H941pUPpnww+xaXuiXE3LptVNMn1Kz4veyTkiRYJQxKy40ubQOIgcuNPsVWZVAFi47vQWiZeIwJlZaLjvgZCe9UhRxUlokL6gIMk44JYlADV7VMDCZIVybQRWj2Cimsk4BQHZCDWX0VkJdXXVfHgq4xSq7L3aaRa5ANX3QPGfAD8QuEAAB+oAFU73QdSfjX5eoAMTWk1Q1fdBaJ8nHVa5gFANUlpAMcm1D0A7urmB88d4INU81zNRYW-gdSVuBFspshj48sUidUmTSMsZzVrVezAqRi1fbnVZXAqTocCs1dMMgDBAxIH1BpOYlOrUhAWtYcCZOutRrUG1OTsbX61fUE47m1mtX1AFO1tQbVFO9tX1AlOTtYcBlOrtZU6u1NTunIZ4htarWnyetTbV+1rtWbUEkJtZbX26gdQbV21YdRbWHAjtbHVB1LtYnUG17tSnV9QntenWHA3tYnXcA2tWNAgebINk7+1+kFHV9QodQqTh1hwFbVZ1MdZXVx1CdfXVJ1kdVXVp1TdQbWZ17dX1A51TdXnUq11tX3VG1hddcDV1JdWXWj1rtXXXj1jdePXJ1XdW7Ut1cdZ3Xj1PdYHV91OtbnX2Oi9VcTl1Bdb7UFOatVXVT1VdTPVV1c9ePVt149cvVV1q9RrXr129YPUP1u9QPUR1Pte+Dx1Y9SfXb1BtefWt139RnX-12dU-X91m9cHWgNFdWvWv1oDXbXD1ytSU6H1cdb-Vx1l9VXXX1cdbfUFC+dS-VgNvdc-WgNNdbg2HAx9Zg0f1b9YBAL1CDUHUoNS9YA0YNO9SA2ENRteA3ANBDZA1ENwDafUkNLtbA1HAlTpQ0d1tDcA0b1jDcA0QNd9VA2ENxDfQ2cN9DUg30N7tTw1AN-Dd3VCNwDUw2ENYjSQ2sN4jew3YNMjX3VyNfddQ30NntSB7c1HFfTAY+gda9WXEF8KdW-hB0LERUkaTq1SZOGiGk5kiTwE-RdQlxNoBugjjRzaONJ7kf70w4dfUxT0oNYK6ZIVjRrUmSvjUcA61QTOI3hNRJMk70IWidY0mkdzEbXx58tV0ARMr1csn5Q9jYBBfVETVcQwMWIiBhONXjpE2RMQ9B43gc9NZyz6QMCZNJkJCST34xNIQGYmhCX5KtrNN0APpAQ2jje02dNeEd03BAvTVsJ3kZqhk2xNxIBD6WQgza01fk7TXeTK6T9BgIq1rjWNC10Wiquy7gWiREzD8c0OWUXMxjCSD4Q8CGcAwJEINICwwZCTc2OJbAMuy5Nf1aqyFNdjXU30AModcBlNqTT81-NxEfq7lNrxEaVVNQTWC0DOCTVojgcrTaQlXyeiCrI+h9gsM3VN6etJgHGXUEU26QcNVaUY+neiM3JA4NQjrMg+3o4210ALebK+hMdB82qAxLb1A6JpvIy36J-yeM2xoMcu8q4tpYLDVTCoXNjRxQyTlMJctUeusm6QfLX03itvLT83KSWEsc11NJkoxTEgilKy2nqMJS1mKa8zT02hcyFN+WkC9Ld4gGY8lL2gsUrTZi06uUwqnSAhI6JMld+BzdXqsOn9Ia2Mtr1d80VNqoMC3WY7reC1b6X8pC2sV0LWEwNNcLcVKMta1Gk5otqaIs3uhPiNi0kgeiKmjvKPrTAyR6CUCq0ptqoLS2vMCrR63DkKrRS3JAkNRYgPqzDJM3TNiFJYkut1TTurmtsbVi2hU+KkToSlcKg62lcL8Jk4WtzIMvbnmZlUzIWVmfHFW2VTIGM59V1wDjVDVoAGNWTVFAbNULVy1S9Cg+YYMk6oOR1U2mfoJPndXdVoVS1Vgo-tudXbgp1Tx63AV1XCB8eW7RlWhVj1T+muO-lV81GomyaU3StF9OMxkiDKf8mhxDtCQqSapyf9VIAgNTAnA1-7T83g1gLNoYatpAjDVAt2bcFAI14zEjUntKNXp6aGx8eiFY18cU63Y1d0JO141BNVTUk1ZNcbEU1RNQR201k7ackM17+EzV4ZrNamjs1nNcE1sgvNUx3814gCRBC11vpcxm+BQOLV4ZUtcdEy1NNBR2K1yrCrXKNDDYHW1wKjdbVSdhwGg2mafUMY2ydcjbJ0yNsnVI2yd2jSECydmjQp3B1ijZk7id6jePXCNkndJ2J1snfJ2ydSnc7Xb1qnXZ221DnRPUWdz9Yo05O4nbp0G1xnVXWmdGtbJ10NlnU502dhwCp19QanY50ydr9Yo1OO4nVp1B1nnVvWu1vndp3mdTdYF2RdC9Rl2hdpDS526NijQfUB1R9YA1xdptYA3edcdcl16dAXQA0ZdwXdl2O1ijUU7idMjdHXFdgDQl04NJnU53VdcnUF1Od3Db7XwNhXYg2ANLXRF1Z1JXXg3z15XUHWVd-nU51WdinXvXv1ZTuJ3GNP9aN2ANUjQbWTdxda7UzdBtXN2pdZnb11kNH4L13id8nanWANcjQ7VbdbXSHVldgDUd1ANZ3feBKNw3UHV0NAja7Xrdtna7VjdujRN3tdT3Ul3LdvPLk2nJ1jZ9W2NQbWcStCnIHCC9EEbVk5uNIbZ40X0PjcEBS6iPVOT8EuPcj3mN0qc9VhNsPYC15tMUCG4FAmTfE391STSl0pNtTRT0bK1PQs209OTb2qnJBTZ9U8tlTBT1rJmbfD3kEBPYL0pOjTeBH+V4tW02tNSLVmj+V1jbq1bCtcPhCrawnUM3Egk0hQQ9IvRBy3MY8vbE2K9oXLXAZJNtK03K95xMb269pYC-AeNsLTB28qZda-RUUZna-SuixIOb0kgxvaABXRgAPfKN0YAAwKoABvpr9F+1QmG22LQu4Fz11Npzf9bGAFzT0AwJzzd+QPNzkE82vIhFK80A0ITbGkFAC+jz2i9XrdS1Ct0HYdGgt5Pb62kk0RCL1w9YvaG2Kq+pOy3ItIrXK1OlOrquxvVXGNm1qQ4fctLPt+LVQW-tqrFr1I9zyabzD9U5Gy2ItVvc7pJtUerz2StMzfP2yt2gKK06Fz7Qv0Ct6-bK329+9P5UFNKraQmKU4-b0TFt0QGX6KaUPQb1BSD5IfZ4pg-b7q9oJrQZhmtMbf-qWtWSvq2iR6HTX5OoYTm0D4qmHXLX39YBdr1utNfV63CS5fam1+tXrcf2i97jXX0eS0LNX3ONLVGpAxyr-aYhxt7fYm2Wy5WVllM9vrX02i9XfTn379vlN1ra9p-RB2W6SaPr06t1-QpSWJwA8f21tmA-4BxtjbdXrNtdelZg99kmqw4se-bXWmDt91aFUJVmzkti3QzHdcAjVE1dNVzVS1StU81stRkwFikPrUoJ8OxLzLrtaPi5UHVwVWIOM+XBRUzHkF7U1VbEIQK1Ux8-leYOZVI7QW4byUVfe0hyqyZ9XPtj7fX0RBEUB+3teKqcFBRVcpB+2rsgQ+qT5JVzc56hDaOe+C-lD7W4P4K31YdHfVcEPPLgct1kSTft9iPoZpAUQ71Afl6g5ZCnJ4CgRBiULcks2CwGPqWSQVL7R2r+pbXOZUiD7lUYO2V2VekzSD90NO0KD87coNMdqg7iwbVmg-WnaDexLoNEgWiXYOhVJgztXeDcfIMOiD27Yz67tqgDYMBVcw00MLDw7f5WODzvr8kuDeCfENGCHgwcNIDW4EX35QmQzHT8DGdL8lBDiLc543DsWh+C-Jqdj0BxDl9IPjPD9ALDBvDr7d-k-DQHPl5kivKc8NpYmPvPA4+4SZyCft9iA8No5xkkUMgj0kFj4QjXw9oppGCiWJSfDgJAUMVDoNHGQq96I5fQiR4SO1Wr2bHl1WXtpVVM5jtVwBO181nQ7O2KDC7atVLt2KMUwGDlg8MPHVn6HVUcjQ7ZyPWD0w6ckTDjPg4Nju+VXsMrJ7w+4OJD4HGcO6QFwz+JXDQBvlW3DFycQyqjjw-eCIjugf8M-VTwyiPfDrg9KPFSwIxCOgjyI0YCoj0IzHSajcI18wIj5o0iPgjVo1COEj4zJiOGj2iquw6jXQKSNQO5Iw1WUjzVVYNgobQ-1XYd9I-IOMj3Q4u0LpxoN5Rso0FKg7bVrI4ulw+aoByPI+C3j81-MbLqCAMY2DnBoPENTGI6rtwnusWY8HMGin59eowL11jAkrz2hyuUqCAmO69N+SgUAkkcN8ubzG2Pp9DmfQgd9qTTID2CZCpJrkAvPeQAjjiDKCAmk5ANgC4UdzbuC6UtzaJSuigALLyNAYAAfboACS3oAAr1oADB8YAD5yjQGAA6to+ks45cTzjuFBONCUwCFONz8G4zQFXRgAM8G+4weObjZ45WOJO5CD4NNjqyQQnfVVytcy+DjCghzFkY46VzXxFkN8x-jFySUVVjK4O+3-j7w4BN6jwE3fGgTjsep7FkTsZLRopH7Y77vuMwzgmJDaE8aMejJqSBN3Dfg86R4T0cRmOWQBE3cMIT2fWsxrIeAJYAaV4IBPDv1aTiMhuNtWDk6tUeTrVgFOrVEU6tUJTq1RlOrVJU6tUNToPh+1IyMJO1Yok0cDiTtWJJO1Y0k7ViyTtWPJO1Yik+-XudRwOpPsNEk8U6lOFTtU6IDd4KPUjImk0cDaTRwLpNHA+k7w22TSkwV0f1Uk9ZNyTXk+-VNdrk-5MGTgU+Q1DdC9QFMKTdk0XWrdnkzFNKTfDUcDGT5DTU6hOHsiCyaodIyx2AAgsrrjgAKdygAKGKgAPA6gAHFyPQ7IOqDSTnU3Xj7cEv3897cFv2NTxUm3DPt7E8gj5gtANxPCA+kG3D4QNshAA3238UR4ZUNNM8C5w3EEnT0M0Ttoq5SDo0WO4OmwOaR9CpxG4I-Nznr2jVQnjsX35jc02TALTODtNNPuhwB+nrTe02vI5Tsg6ACbju44H10B5U5VM5g1U4siXjwQHVMUkDU9UyCQzU99P4Ktnlo52OQIASNdjLY7Y6EKIkCb0nDFAJOPTj9iBOMXwu8pEDjVgMQPHrj7AYADOyj71EB+U8VPlTh40wB4BA8YACm1twGAAGPKAAaMqAA5AY3RKEKACAAZCqAAmEqAAc3KAAG1nrjgAAgJ644eNPT9iBEzXj8I6QkbT5Q0CAsUaTbXTXME09aBLTv9ASMvAk0zLOQzYHdhPgTwRW8xzjC41tOggIkHLNazv9BDVUU-MwuNSzU03g5yzJs4rOizxI8RTVQGszH2a44AP0Q1DzkKLyTA0sghXy0bzfG71Dwg+WnrDwY0FXceAw0D5+zm9g2kjDaY7tUU95YzVDbDHHAjWvEYAxRMfV4Ea-bAdFPXKTr0RFMCV89vrc54JzMDHKQpSB6WJx-DJcxC0WCwrum3cAqjgZgaOvKgXOqgZmr8AxycZCq1smUBU9Ujc6c-B2fVBfYqGC5g9EcB2Tg486HVzovdaFR6-cwcbAOPc6vR4lbJKdSvINc3RVkhVc-OKKa8TlK5O6xIDQNFIcHRYZTIaQP6ANJWeB7JU6qNKcDIAzs17M3tLLoh1ntyHSZL9zo81xgq1k83PRQDnrS30-iMrsECntN1fK4S0zoqlbRypAzb2DCkQN0TaBVsAQAdAuITZX+A29IixAAA) to go to ts-playground and try it out!

![type-toc-example](./docs/imgs/type-toc-example.png)

# Language Grammar of the Interpreter
> see [Toc Grammar](./docs/grammar.md)

# Implement Detail
> see [类型体操之实现一个类C风格语言的解释器](./docs/implement-detail.md)

# License
MIT