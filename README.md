# Toc
A toy interpreter implemented with TypeScript's type system (see `type-toc` folder).
> As a comparison, one was also implemented directly in TypeScript(see `ts-toc` folder).

👉 Click [here](https://www.typescriptlang.org/play?#code/PTAEBcE8AcFMFpwHsDGAoEGwBUAWtQBZASW1ABkBLFWAOwGcCAKE7ASiy1AGElpIATpQDmucKCYo2oAEwAGGTPjQBsRrXAAaUAEMANgDdKtULgCuO2sNAAec5eFmke4wAEkZ8HqRIA1gDoUJABbAD5OEFAAJVhoJHpKZAFIAC5TcHBoehSQYUTzACNAkOB7KycXWmBkFH888E4uAHE6WAEdcFgAE1ACyFAu8Hp4ArNaLr0CAzl-AHZ-AFY0NC7YFD0dVVBgpC6zSdAAchrD0ABvNFAr0EpguIFxM9AAMTGAeQKAKzWtF-ev7BIADK4CEVlAAF9QAAzAQhUAAIhqwFetA+3xQ4ARAG5LtdbvdHqAAHJIADqOn6UNh8KRqGAMXo+yxuOuNzuSAe51AxA0bRUsHE1LhwURyOMnQEAslOLxVwJnKJAAVNoxITCRWL6dBVW1ZWyFVyniDgkKNbTkTqBIwBMATSy5ezCdygShLOqaaK6ShgPQ3bRaHrWfiOUbQIDfHQPZrvb7-YHbRG6Prro7gAAqdOOq7pni4BwEQEoQ70G60aCebSWHq4JAGNqIxnMhEQJCgRgEcD4UCqJl6cD+UCAXg3AAB72dAuaHgHEd6fT8fp4COqBwaJqZmgAC84dQNgABuOrtCxqBhHReSgmAAPaQXNl365HkzGC+QG8H+-XS+gADUoEgwY-a4IXfYC2XfAxNjLFAAGZNxPM9aAvaC2AAu9n2gphFB-WQ5AnUAAEY5Fw+BQGQ1Dd3CMC2VgS9nWXQsdyBDwBBoUAaM6cZS3oUFjGEUJN3fV1LBsJizBY2B+PYugulLYxoQbJMGHfNkAH5t0jBg2MvDiZPUugAG0AF1lI-NSVWtWAbEU+hJO06TZNoeSBFAe16BMwCrjU1ytJ00t7SM9yPNUnk+SlVRwBE8BTRsnz7LLJzQAANX0MxYECoL7zU5K9FS2LOL+NEvh+dKMsAtTUXRQEQTBYQbGy1LKNKpr7zSeq0ua5q0lJClIBsQ4i3gXlJWlehDkajqPzSbzIjaOEBBKlqSXJSk+oG8zGDGhbQDSazQBmgQ5sCrrlt6-rUHgITaDG1C00zecBlgUZhHnRc2XokKK3ELd9zZCDnK-LdCLkAA2VC-puOD8NQ6FOQkbEIZsUAABZ4coDdKG-fCOEAgHQC-X9KHI1D3t2rdLpsXlPtCYmYAIABBbi4PWyzrOppdadAN5PE+uChv5cKbAZ8A2eAlY1g2LYdj2A5jnpCqisxU5bxDZ0ngAUVoIw4VoYI6DNT0tR9CV+cFNpgA1rWkB1vWU3lUMiVRe1owtbVdVte1badRVuUU52vWRP1LATYBFM9x0aLojn5YxL7znfVZ1k2DpKCttJHai8BUOozXKG13WNDSC3c6t-PM8dCEbuo2jvfegAhMxKD0Lpo5sd8ABE8t09PTU0d81c70si7zvXe7Zfit2V+8E4l5PU9ANvR4-OhLetgvQDVxergrx1w+rrl3ujqqeKsVvAOeAeCvRH5N7vDupPy7vY+efTDmnpPwBTq7jLHuDdxsR9QAABIzgtHAKiYkOhdY2GeKECETBgHmUgfQI+NUbBtxflaSBptrSHEMrAtgoRdyV2uBHGuHNQHgKwdAi+0cfjjxeC-N+7QP5W1wS-WgWC2GHEmJeWAutcHEKuO9RBwRkHAmPrVd8IjSz310opIyN82RNn7BfbiNU4KHEODfeh0iL76TkgpC+iltD+FMQY5yUQjF+AMoZb+plQDSJQbxGwURtC8GCAUYwlllG-GwC-HhfDYC4NCONO8aQfE0xXO4zxgZT4fjpqoiRijri10STVbRcEEmyNLJo98ala7vjSLuYBdMITaGAbXCERC0CiyYQQKW+wCCyx9D4pWO8q6RxXGrA6nIfE2DVvQp49E0iHG6XNLRbEekCELpCVCpD94cyBGYFANB6D0D6VEQZEBaYjKWSstQo1tC9mZOE2Z7TUwdLISubqK0IG6zSbxehu59LALubACEhkvZrMoAUA4+BVAAEJqm1PFpsepuxGlHHFKFaUbQ2kGnttyG5VJzT+3pD4z2hoiRO2FC7H0VobR2gzpixFTw2rYA5ritFPp6JhwRarUA9dG5dAttoIeJc9Z+0NsAY2YVsHmxzsPDQJKGV8z5eAe02gxXSntHs1ZpYqXct5bC200rwoe0EVpTpBA1WCjifeby2SXIZwUX3TWF92Wr1jkypuFsbBnDKaAWg+w9ChGSVccgOhuI+IvuSjmAAfJ1Lq4LOr0HoDJZMM4yLsvlfRjkGxAgvpK0Apj-DmNXIzI1-lbGBTUrqiVGcRJss1rZXy8UGxRC2mpSxRr82yuWfKmw6afHaHTRbUJE080woFoyX4rKM3Mg7R1U5+1DoTWOj1Pq+bNqlTSJ671a5+y4hBYnSWEKZaWjdvClW3snjIq5bGDFqEsU+2sSYRVsZA4BjNqHY9pL15vHPhegO8Yb1npFbuhxZh6C4APciTwjd6DAE2O0SAdKd1hmZsmqDGc5UHL-a7CytoYOmgABKwD0HAAQH6ww4tRdyglZsNXnKuPM8QwjdRWTPdGst8jDLaENTG3S2a4JGXHu+XaRr9Jq0fXYoKXko1HQcbqe0VGNIxSNc2xdDRO0DpUUalDEqG0HKbfGixra1MZuFltYKzMXFqF+Eqb9uBIrRW0JsodnU5PiFHZyLaE6VqHGZtdGpyw6nbHXU0zdSGiWmm3XbBlvtn30ivcHW9JGvZhjVrRZywX8Vu3NjFnDRJiCrA0JQaElAGxxeAIR20AG9D0HA1cXe2rjWmgpSuDc75A2HAjr2BIrCatHD+ocZrhxfmoF8G1wCtWMs9Y-LVmGAgBv3iG2MQ4mqyNlklNCHQrEnaTzvMM8r4BKuwFQqBC5JC97iF5XN1i0WVBOyzRnOOgEVt1Ziwcz+k33z1Zu3PI7AhNsRem-t+bBAbUspi6J-uRrnulris9xb93rvfKe69qiO3nQfdYslAQJ2mN+TO0tt6OyWubDu4BDhus0ipb1hlrLL33zGESJQfQlAABebRC4xdAIG0NegofbdI7tmbbQDtfYbk3BHoniQXwJ+lzLbQ2UWvp4zl1QP8p89R++XHsAupZ3xLQcnlOafTPXizkrlyuRw6+94FAvgkdltBxdjHHXDfdeV1cbi0UpomsMtr0ApXvb68ZTzrotcreicY6bx30vdLe662bj8duhgO+is713evQpc55NCE3cVQ-3ku-1m3oAgjjHJ09mLGeMvcA2N+xXq2M8YcYIXnQxfI-iEl2G6Puu9tx8+x75lxBE+FvfLwbPLCTAA5i+6hPlfi9JozoPtWhXYDD7VKd00DOg1hpDS6x0gfSzt5T3eLPXQc+0DSN37fvf8-QmnyX9vJ+y+T5P4XS-RfGAN5h275vrFH6j7n2j64l3HzY4-ArnaZ6M+YK6ySjZB6S0BGQZ4FC7CpCMo+4Zz35s6w5P7c7MqPz6p3hvKC5pYfwi4CCD4iLYI0ZxRC7YHE6mqAS1xQEXzB5G6Sor40JjAb5si-4khYIAFJxAFtAgH4HAEQFQFpAUFdD-jlxvbs7u7PCchJ75SMEf4W7Dbf73hk4fzq606rbz5M4Z5b47504qBqEur56ISqClzaHOR17M7viQGCE17wFaqP6zYt7fbiGI6d6AS8hq4uAa6v614L7hpd5WwH6fzi46GmGD7niGGcr95BHeGD4CH9Cz5aB0FGqOHSHyiq5KHuEqGuFpHU5tAaF+FaE8B5GH6k4GGBJryhGlFlyAQWHQExGvYroSzgrSxeYhavojbnYQZEgADSsAkAAA7pyDJNoIpOtlys0tULTPIZFsqMZghj6AVkBiBpSMli6DoPJLMcAPMcAEEMEDsLQMsU8HTJhvmNwPmNaNoMSGYMECcaqNoEZj+tcbgS5DqDQA8QqvhrGJsWorxMVlMS6P6GMpyAxv6HBmsusaFkRv6Eeo6Cek8N9sYg+s8EMWemCa0SHO+lNuzu9OTImkal8VYNoFksjqAUZKxnggJIBDiUSbkqVGZMZoLGyo+pZmEi5BfMUmcOmkCM8QQFmlya8RCMAlJtxFUlWi5P6PptxASUyYBFNP6DEUWqAHTGzNDkIosrKVASJA8viQqVYhpCSVuGxuSR+JdBcR4m0CJKvqKZYCCfQKpglNgBpglJsrmpabQC4rcXSXTEMSEkJpdG8Fhh0JyOaUmsCcpmsraQpA6RWlKfYuTK4l+j+vSeGN6eOi6cQUTmaUCBaZdNaeGc5PaeWhYtGfxi6W6fGSZp6UmUWR5DKVaRIkGVmiGfsmGemvmc2lWTSSWXGXceWV6e2RlDWbQACQIHuAAKq0C+C0BIC9EmDIAaS6DgBpDAJAhVJKms7bIri+n+lJAam4kSLsYUkXx+lNCdBvACDkCdC5k8D4SRnOTcAyA3nRBVleSNmNpwlnp7jALcD4T8lnB3lVLaBslfk-l-kUTmZVlTSHnQBqwACOp5pIEU6aX5D5d5D5Tpsm2ZoZNpb5GkH5v535n5Mg-5oAgF+Fv5hFoFj59mLJRqfpdM4wl5SFBZPA95TFaFE01wz5VpmFNg2FdAuFQFBFRFJFwF5FbqlF7F1wEFNF0Ap5DF15TFKFrFfZxZGFTZWFnuik-FpFIFAFn52lolYFOmk01FRJbJiFSavEkwfpbQAZ1oP5zampwgwpElKlL5KmvFrpQIqxlk3ADGllsA1lzCnINkbiYlbFLlxll0Q5fU8F2wHQKAv67ofANlSQ-gLmyp65BAQI-lgVtlpY1WvWRwZwo2d4tWEIJVbItWmgFV1wtW2INVVwtWTADV8+hwbALVtW34HVRw8A3VhwwAfV6YfVAApH1X1O1qEH1QCn1RuJMezCuEeSeWeReV+RfGNKcLVn1G4jIGtbNeZo5U8npSJT+VEFUpEgQH6TBXBUgBFKtUaocLNa1dNdtbtRMjWkSXiXxL-EdYJcAqddUujgtdAHRV0DYHdVSQAGQTJ3lrVQ37W7k1SHV4XHV-VnXzUXUyXDng1lqHD+rQ07X3V43w0fV7nfXI2-VnD-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-O5RJya97O-5fe-Y3Vw9DQfXnxZ+a3-8p7aH0oEScKmgRSdfT3qaAAElob6VBWAqAIipdpe+4AV3r7l-bRR-2a7FlBuydZb806ElKSkSX97wD06nkHvibHABECd2RfYupFXoIi0M4CXB2vmlQJAhqBjA2gYkQkIMCSBv-ZXt70gGsDMBdqHAe2hoFWYl+lXBgGYGgCEhugitDoBUUyrT8gQL8LroZDn4RZ3ozArgZAMEg0IdBQnD8NFxf44d-WI8cDioKMZhtlC57TwnkjIHipUBVgtwhGwwHGCS0F8dNMQErQdlvBguZXvWhX5eDEoD5dwQYE9qIDyB-AsBCKH3w755SYQ3RjyEsQ5dt6J0KdHwIMEldFo2gkATEJCBxDe8CQ8Lu2mIa5D7QzwWIYUU-i3trg9DaIYPjCFxdc274WuIlHX6pQRiW4YFhYJfiaFe8uCYAfYPAEqARIfQ6oawnoypdei7aTwezR8E21uAQdfKCMMRzcVEKIQpiokLAGZC8hlQgoRMNoBtRihMwzWG4k2FtCkhSwvaGAFmh2ZZ0ZvU6OUIzj7CrihwwaB3xUDZDmSzw00K8MKGfxjhggsIdoCJ6MpEo7dLQbsIqFVCe8gIkZrUM-76C8hjQkoealf6CdB83AdoZJxLa3NWhOIokoL26EuoI0PIZBGTzBoQiL4vjewQ4JlSFpLB1RNwWiPCFzCEotcBYcWU5H+CkBgQxtOmjaGhDWREQlyC-GfBhENAgwiIrlxcqRDxUz2MYVYJQCSjwALI04WyMkyaZvB7A0gX4NrSfC1hQQ7UZsNC4ijdRd4eUdKGiH-DDhJw-tJcItEl1khNwyZGOh4EOYnh0Il4bCP8JWw2oHwlURUW+Eplfh+Qt4XCKtj2izh4IpITyNSEPD8uhwMMbaMjFHCRm8AGIiGIzpL8cyQolyF8zCG6c3OGAzziEg-oyFF+fA33roIPKJEaxhg+8CYI85mCNAg+c+PWMKgxxoWnuFuIIPbRkiLYJfLxP0hjGWCFcXCfpkEimEwJ2RDYMIfYKaEYiNOzpXMdxURLTDABiY1ka6LuGyjFoSY5gQ2PSprkoRSAygYiJMplpKB4+dEaYN35tjwOqwpUf0NuxTDZhWoielyMtE8BlhukVYTmUQoPktxNtVPpSNTo0iyeOwvkYyPFHH5b804tgSmUsEbcT80op-twLlH0j1UsEurDfirwbR3x0AiKqGxgmmgcywLXAUJmuEJjjKh45XpQJPEJsOO+aFAc4TfbRRPCZBIwTuOXFPt3w86cAD6lxEb8OYJIsNBYKjR6IOS+ETwiYjMS80DMXEnNEwOV5sTTQcpB-kCHkqJDzMBmFzmuJX6CTTesfGwEWNPYliiJD44WJCPv5qS4ByA9Uu+CiAhDnJSkuItxKuAj07wLk3keQP5EqZ00pozTNsN8H2SQ8haXtOcVZGHta6Lk+GLROYlnjyB--PQbiJRH8c+JLQlwtYJtZwRLBihcNhrkbYGcQoLgjwjKOGGGiKYuUiNtQLnHOQ1YiUfDoSOvGGjAJmmYKQlBAnNQ1IZIdoNAG-59JNhQ46rrEn7TjjOEhkfxEc0QlJQ8BTUQuO0MSmS16JSA7-tmKuBpB+pnLIadJhsCUTRpi7UcYXzFGP0ppM005nNKZzliaaO0waZsHtDDSOhsATfrMIU7b97xb-PDqpLInL9G0I04icZQtgJTbhUyTQXZKQEg52Jo9HDhAMbF3hmxwOVsQjKUS8xqpKE8HI1i-hITrg3ktGQaKhm-Z1hnU4CUDN4F-ScygM8IaR1Blui7M9RMFB5kSZjFNiixSABr0-QwUM+TTMplbFaYL8CAazKwF2HsZGpLAkAA0o4xmkizcAAiEQmVm7KCwL4EshROvHoT6RU0FZNWE7llYcclQfAZWeLNoCSyySW4QkmWk1kKTHSwEz5GpCeDszwk5-SYEYXXjqg0ggYesJG2NaCz54cIaAEbKJKqyphO9IkvN2ciAx8Z1wC2XFCtn+AmADlY2abLYDyT-AmRMyaED4weRq0QmcAhDJXCxw24-smwPpHkosVoIUwmQDf0TYQssqLgGgIHLLTBypUF8cOVHKuAxzY0qadOdoxTSmIE5vNFWSbKMhsAs5fbXObrM-oSp65BAMmDPJLlyBtAZc7QBXO0BIxq5NhWuQUUQgdBBYskpOWrLpgE0g5w8s2aADjl0x5KWsmQJPJ9llZ055AVuQ81Fxuyk5cECWQSSHmmzSS7cigHQGECizFSF8cgM6TpgiNUi3zNlBXR7LqyN502d6N3nAA6BjANpTubpGbmvyT5kAIYpkn0jhyzZAk-+YAotJyBnSlPITNcw3gOJDZipF+BhmDFklnmUE2TLSJTKILkFDANBMXMVJsoN570cAOwpQWyStwgizhaXO0Dlyph0EWyQXNEX0AdqIiq2EgpQUlzPZL88OSvKmFqKBAIsOJsi2ZmotvMhKRTOhkwxwpA2xvEftJnOInQLealK3jk3RTSYXeBjWgAyQ3FBZHFPocEomHRLQl703ZHmQsQOhLFNUxvenCHwSzPYKmzMevsJgshN81KDvBLLEpiymKsMLvBydoG+zqTfgVneGdkt7EGDClKBBsSUqbg3jMB3-XWsHy8W5YEsYfW3k8GQbE4BWp9XAOozoBUBIwySnzPMQFmKyRMGcAfkPxN77TnkimSftP1n4UR5+gyiyAFLDJ-iUcPccMDqRsT79Le+0p4OHidk9gDMO0SEHAt9mKYxMdAQgvlDoy-zOMRJDlu0rOW0BullkQ4K1jEqCltMHZZmP-17S10blZaO5QlQeVPK+oxVN5YpO4iijmYuS8Uh8uHSgELlukAFSZkUjAqjG0IMaKhX0kJczIuoC8T8oy7wqL4SKoFZQEjB9Qv8YKx0lip4GvNmYqBfFTSr-ziYiV8tElWSsOByFKVFaalTSo4rxLGA0QmFWIMlqpLjshaVmJqgowWRBVHGajOsrAL6c8ZcEP5XFGJUorSVzy5qlyosQ8qY6vaFlfcvVXsr6q2qrTE+X5WwAbRvo+IVFO8JxT3Jty1lUaueWvLMVEKkUnSoMGvCrWNgvpF8semRT9JSQz1XsJFA+qbWfq3UNDMgE-KXOkyw+kdh+CIgmALYVYq62GygAXGNjLoEQ3zkEAQ1MIkIOGojZ9JvBv8-UUSUUwdSEoxajXG6thXFkC1Pog4WmJhUN9ypbQWut4Lpl7i81Fqq1S2r9F8dAIKqy5Wek8l3ha1DYOIp6zJGjrEVTqs9KipNX1qmSOK6VV6rDUlFS4basqVkTrV2rV2oq4cqzAam-jnS1whTFGuJnGiJ6hw1dSKX1VGo1VS6jVX1BXWsVdV7FddQKs3VFrt1esXdVOpTqHDhVaQeNZg0TV9ccQqa6EOmthivirY19NhSkLBnuigonovqE2r+HWqBhoSGmthvDHlEd1sq5lXa11KKr7wwGzwrOt8JpjgBtG0qfOtLAvqNIqK9qqaoZX2JCNrw8WgZnbX7qX5AIq2NoBulHrr1ow09Z+IbA6jfByyi1YkoFHaiANbYz9e6tkxPrHVhq19eyo40PqEB-av9cED40Sk91RUoTfepChBjS4YGi1f3wTW0Qk1CINgLBvg3OQJRFRZDXCr8ErTpSjwrDbqAHXBBiNesJiR3UrH5rAtRmuUqRvOXyqJ1bIajTOuCJ0ah1DGlLTlOs3hE4ZkRHoeQUsRbhTlrMMkTyKvULLYMJMjkVAX03cahl5E-RigQME1SO1IGtMQ3yy2qaYiYVL9c6M5E9rwZGVKVQKobGXjmNxJSjaAHoRjbiVoXLBJgSm4vz3la6-tWMGkRCqz1Sob8Q7U20GrAV6aXRLWhMYCA1ZS2x9Q6v+WLq2Nb6w4KCpq0SUf1sAaFT8rPWciLR+SeTVWsq0NgYisAiKastO28q+Vn2lflr3oGQC3ktxdgvQGyVQFut6mwHV7XjFob7hHo-zU5kC0Nj4AUKhyZtMWkOJUN9M-cXjog2BldwUG8QDdtOC91hsBAR8JiACLVFWOaQydOjulWY66Vq2qHbjvA11bwAQ7cnTCDGD06rYTqLBNoFGDiBhAN1aftZH0hyBppxwCYuoNmUEaMdtANbbFs0jkabEc6uVc+su1dLrtWqu7T+M00XbtNV23TRirU0Nrs558tWaml7RjzjKHO9XVDt4CqB1t0m5yJto9XyaZtmmA7YQKO0nbwVtujTedtVUG7Hl12vTTbuFXBR9I0iVOU7otE87ytE-SjgLraoTIJdJ4aXUAkpoGY5dCutQVvRIn47dxA2uFUmNd3SIsdau6RB7qLriaM9fOrPY5r66HBmq4uzwPnoXKF7Zd8u1QUro0Gf0697u1VqNr12VsKNeBKHfNuFykFPk+pCbVNpn3m69tgexfSQUW1h7ltZuqPRbsN3srqqnGnrbVrZ1u72goiZvbuqVnJ6HEC0vzUnrpKP6lQYlR3QZmd1bS7NwyjvXAD66AFRdZzXoH3ql0D7gEQ+0vaPpV2DaOYzMC8ZroRWlg6MuusjVpsBXOq+oxu+PfYOPVe6iSbaLbfYjVgfaJNRopTXera14GI9maTA8ip03PK49AOrCacue3e6E8QIEg-dq4PkG291amTfBIImodWDgO6tJHvyisaT9zyjbtbrEMI7SB7B-SWeonyMBuDTo7zpPm4MXxgdVBhsGoanwISTdih7bbzrzGe4LxwmtxUPmMPrx8JxeOHeHtMOLRDDOh3zS4a9q17cVHeU0A3rb3wA5DCe0rnocUZt5fDt1SzWfjsM3S9J8OwHfjkTwE7e1jKtHYgYiP+H1DGceAP1ls0k7hyoyTveIGc2uaGwGWTPIcK81WYyDVe9DatPSGs7GAlAzI4Oxizc6-9meyDUUeTUthqdsnco4htoC5r4DK4bHX9oijIH4tE2uhlJI8kr7z5a+5VRvtjlo8f9tK8ww1qbjQrXIYlVmKu2m3R7UV5Vc-fEbt2hGwyOShyaZiGBOHa6YxmghnDlJFbqMb9KNDIsi0WRclmtOMn7mTwB4P+Lkfg1kfq23qE0qFc1fcbd4xroF1x6HS5Gf2RUog-Wuo-wqZi6hoV+kGFsVTua3bMBmlbmvC2OPuK8Efa-1XkIeUoHxt1y5Y1IdZVBTNgGBQ7QtseIKG+2khhdcfpj3Gr5D++j1RsZB2e5-+COCHXariPOGMNWmXbYwct3PLZqJx8U01Ae2KiODlaig4Icam0QTDWEw-bSc5PLqeTVK04zSoe2LL1KzKIUwybF0e9oAtxzQ7-vyMFdujMG3QHBobDgxCpNgrVA1k-hVH066e4E+3swbMxQA7p2qRVKxkBE5sjcJdrjoeEOnCjgB4o9iBbCwwEQG4Uo85HBgK5fTfm+MwLqzNYJhjp4hA2qfFU0m5E46qYQVoU0xYKTgLAqh+CBOtHjsX2jUyoC1N6r2TLGw49do-Wsmba5xs07anhn9IYstplMnmadPJmXTrrB7BDiGOxmM6SJ2owzL0UNEDFivepT5meycywwnig2JelRLhZw+RISPnUvJYZVcWLS7LHUsd79Ku+W857F0PaxeoeOV0drMIDhDSC+qMSTYBzPaxjA-zfVFwJKH0B9V6OOgMdn1TdBhoMet-DnAIHjz29lWK2J87TGsImtELLeKgKBb0D28ZRePCLSMhAs2U9AkxX6CM1P6iS4AGF0Qu02+w4XSLiopxkSLxFwALSjF9oHhfpzKtj++zeNuFprlytTW8OOrpBcmD4WctzkFCxbggtQWM8zBa897K3gKzbCIl5ArzjEtjtmLO+n+haRHbiXmz0l+XFgh2i0XEC8rBUkV0HL04CLMluACMlfN+dyL1wP6G8iZV0AM8QgUQAPuezmW1LWFuZp7l868dFRoc68UdrFwyiLSIVmyzoV4uWmBmxILyyIDECFx-LseSy00C-NQVbLUlwi3sxGSfmPA0AFywgW9O54VAGV4S4FY0tdBsrJVxUf9iksWkGr0g5C2DgFDzn0rAlvWe7lrjGA-zkljzjxffCXZfzyQMq6AEmBwbjCmrLcpyA8u0AUrPlua71fY79XPcA1jhMkEVGPyZR2gP0vKuJojWVAFpba0NdGuAQZrA+8gPNZSqLXOY0AFa2leiDVWEL8ebgPoG4s6E7LY1i3DBbIsaFvrsAK5nnnfCbBHApcEAs9jzm89VLmV9S5gK+thpFRKNyYBW1OuPE6YAgYQJSdhuMKiS6Njq4BEBug298INjbBDdxuXE9YIBHG3jfevu4xyl136-lfssl5DggFya-daCqa5FIZeCM5VeUuQgEbNV+PN9hZu7XazR17XTYeatY2LSUtyACTY-DJU+bmHZ651Yqu74tcwhRmQk0MWIZCU8xXc0SA8qdLz0dSnxWiQ0hssz0IxKPnAB+LvQ-Sp5bHl0FG7AdLw6wMwKsAeWb97mz9VqpNyX3mLasaPb4XrJJhMGxZRJN2wIA9ujdA05kNIg8vrMcZIK7tnotmuWbOlna+ZbAL8t0ObA07ikUUb7AhrhgqK2ih83f0X5HaljMp+1EoIm5HbTg1-OuxxzVUnW4oVy1jPmUd26yDbCvZonMUaZAY+ZV0QNtHY5jXMKytcX+WgtLAFIHaTAVJEagSQ+N0+-jfQIwGxjGVKeXdrEl80Lu3N54abKvPJm2ZiTwwtMKbUYg5hqQyAaQEvlfbLgj2NzY9jYhPeaY1Qzb3IYWQAo6VlkglwGEJWBmPuLJcAGWARVXXoYAMGzsMstKA1vLm1GG8DUTovTt1PAEqjPHgEcgOWcNQWktWu2Lf1mJ14H-db2iTURpk1lyn5NGvz277VQgHoshB1QzpjgMm5p8n+QCfoaoOaH-NGqBw3k2fVsHDtVh0QpMwJ0EyXDqsCbIROLQ2H5ZVOsQwLRnlpH+U0ECo76j4QZA0EMLeQ6xKgg6mlxR-mWhNLu18pJtULk-MvpVJXmAuD2bAC9kVihLHHKx3rW+jAJw5TD+C+9Aia49DgcgDakcHwhhPDgMgSJ4Y9apIxInCwSJ8DEiezBInAADkicABOSYvAsWS8kYGGiH2mYCIjyBInPtae7Vh9pqi5l3faJgU6Qcw9DgOgSJwUEifFhWqXQSJ0ElarorWqwgSJ3LJDuRPPgkT7rK1TIutVggfVCp0cCQCRPSrrVaCpE7aK1ZRorVNUa1TMCRODAkT3opE8vCROOZrVKnH1TpiRPa4kT7gJE7biRO1YkT9Hq1SaCRPUMkT4gJE4ABSkTzopE-ICRPCAfVYkJE7eCROlQkTgAIqROogkToEJE+wCRORykTxKJE7JCROAAGpE4ACakTgAFp9UAA+nBY8ckwhAwQEEKXYsfa0qGrxfWpLnF5kx8nqoX+QI4wdCO4oM9U2nPVofh1raxZNPrcDJcPAXE6DOXvova7f2bbl0VpBYvvRjK+wvwA-tJgJbOKwl96fczGBfQpNfFdtqB2rUsAjLRO9CWV8yD3D6QMGnIKfoXpmXt1cnurkWtxRYu0Yz0vd-+qTTJhbK5XLd2cnQB2iEPuIpyTu65iRbrmxXSTJXkgLNhkcWW4yaVwUysVyulXcrgZd30jcUd66g-A1zWzjfGvnkKbqZZa40Gf2Q3aLZXmbClYAOyUbFuPueej46uGIn7B1hPHPkuM0gn1C15H1rcQdoA27S8em8rb1uuW74Toq+3vCtS4oUnMkW8GCCJBN2nbfiFXaeD6R82xgDxm27ORTzt2cEGzhFAdlpAFgkIO5s0+0CU9QgL8Zp7fOYk2uCASHPVO+F7eOv+3ebYd5Ns3eLvz3HHcAGK0M6is9UO77wvu6OCtPjlZWFtsZ1vdydOWj70TmSKHfOMeibjIgK8xea73AmNNcAK203dGcbSv7zJ+LuQ+MBtAKAD2S6kdRNOXMhbzzKG5-uZ9s+1Act+GBJcCv9Y6r+kJ8RaYdvRGzwPeyzGuUXxKenrefGMBo41d58uEWrHvUQ-MLSuDrylzVBFJ8vSXSCwV0XbWrieHarClynh4s5WYj7qHjj1x+EXkjOPk+GwHIHeMQA9Pk+BRYZ6499Qwt-Ciz4wFghbgHPlkG6eo5c9IxeY9AIz4wBsCCexp3QMzxQO89ce93znkL8Z9OBHAgvLn4GF558-PLQAuEOzxzGC8JfZg8Xmz8e-Y+axOC3HzL8Z6LvseKRqUKyPQhc9lfIJuUNSHx6Z7ueSvs88kWn1K+meRXwbij8W-Dft8iZXwmN5+j151KBuFTZFHYvlQOKDzyIG3gFk-SxW4lF16W+2Z4DfW4lcStq7lcW+cX9AcS5W3EoMvaWIlt5qJZ338WBYmDvSk2xPfttzkcsNt4800tAKb8zzE3zrjW5O9czoKRTNYvH1-tT3a+uXiyFKga9gOaPufZPmGDphdAug2gNuJQFOnHltAx5VDueW0DnlUOhAXYNy32AW8CgYDk+rgGABzZuIPKcYDRDz73oC+RfWK0X2HGBgi+oCMvoJxb7kDMWKMv70gNyUN9KZzfSviW+6-+TiUYPokLm6mSjFoUXXhkOVyjcrccvPXygypgk6sXqLqHJGflDLH5T3Xxro-pRaShn82ImsS-kcvcebz67OqaqQreBwD4t+zQ9-g07vbALEgTFmLKuPancU1YL8Pi6WPJmS1zf+UNb89mgnkCmrdCoWzjKokpkffukHb074M1qwLmUf0YVQp6nsUZkRqebyrej88C1Isf-QGn6au4ySBKf1i0IEMv+-FDWfi5nt4ku1nE-Xv1IxH9LCzeM-Lh8v-oEb8J-8-phwv2WmJtN-PDpA7P3oB7-t+w-ffpc5L9Tek6xyE5Kcn3hD+t3gEbvxXXAFwRj7izXSC5kP+HJ9wL4m-28Z9JbHWSsR7Q5z2b76GU3PfNM0qdiL8kKib1+h28pTbJmX-7E6N0G3QKviYgL1lNxhPE1nhfwME7BAQSTi0juhIecp7jTbQ2wAbLIlSHUJECAA0HKAARumAAm-GAAp8qAAFK6AApuaAA9KaAAgMaAAv4qAADqaAAIW6AASAmAASvqAAwDFoBgADD-gAGLygAPRmgAFjygABvKRAYAAvZoACd2oADIZoABfioAANzoABY-yMQoKSCulh-+NwNGjyosPhhj9AqwLEC6A4wKABxA3yL8j9AckIoSwA-gEMCYQCwGk6ZOB9s1CRAXaDHAM2YiHaiv+sAD-6rof-lwiAEQAe+LgBUNnTYX+5SlgIGALdvpC+AZYKAAUIYwG8hg0lNpnIU2YaG-6OoFgXQooywSCFyaYasGrA7CJgbjZmBG7OEGvwv-gMIK6dgcASlijgbTYaAo0FZKuBwgmEHf+dWJEF4I0Qd1JxBMfvX4hQCQXjaAgFsOqZLeIQQID9o6aI7BBAcAEn4GarElcYpBTCDYEK6zIgrrh4+QbrwMEnQYOweCnBq9pl+jKPJqGS9-uCJP+wRhTL8+IJq+SbCr-q0EeCkQIQHVEgAOZGgADIRgADHagAIGRgAHtqgAAxK2wRbB2mzJEjqE69wZhqjIG-st4xYHwuz446qwV7SxBK5kTp5cDRgP6b+HwnUFJBOzkkLC+mDAza5BQwNNZaOedHFTtKSgYAHAEOZsZRQhpOhYHbA36OIC9059IcCG8vepLoF6S5F8wWBbKD7Y5Q-tuO6XwCsDZLl6xlNiLImKOklJ2SYIQ0EbsUiAvpy2CWtHKJBwAnyFXAtwXeIH+30qjLXAHQclQq+ukJ5xkiQepbL7a+8rPoyGnrhbih2u+iNjX8qcu8oKhfdpWZrGwUKYHSSmmJfLACOoWHrGhMokZCGh9iM+KXybiCDY7BmokQaB6zUgZpKgo7isIu+oJs5BdSYDE6HdBWEkdIjiUoV0ExiSoPhCXSgSBgLUinBmGFTBBgPcHlQEwdKGihyMtZL3BwULyAchSAHai9oj+r2imBjoS0H9oCYUGEJGBUK6BphWbB4YF+aOjmE-ApgZyEGA8ACGGBgi5lZieh-wQSr0SuYRbCfBgfm0aQh4-tLSkgoAL0SUgpgG0CocgBKWDVgugAKHBAuIUiFn0-yLADTUXarQD9hmsDmQihp0uWEloZQtuFNhiQS2E5kXeIGHphqvijLtiqYeGH7+GYeKFkiCrh664OV4QYDBBkwM6FHu94YmFpwf4fewBuIxgqwXMbflv6AQNQeBF7+1vo+KAQvkif6y+-SC-DeWYgBf6hI9CL5KEyQ4S2a+hSUCsH2C90rFbDSlPtZYnSbKO76JW04tGH8IUwhCIuc8Uj2Gf0REdZbPSIkp0Ln270plJfSgnM76y+VMh35+aIMkxFr+oEfoCV+RlpeI1BEkfXzcRYoZiLvgx-lvw3s-aIv4TiCulOLBIZIl6G6QUnFVL8R3FNTIuciUCyFE6NNAP7x+EER+A1BlkTBFZS5goBCy2KobQBdC68LpwLW57CPrL+0xtcBKRz4ov5zm2MuhHgcTkTjQo8DtDpFr4PoUsHZQBEWFIGRK-LyBeyvntlDHstfsZTLSyOgCFj+zLBP7DkVHOOSTk05KADc2-QOra2U0-H6Sr+zEuZEXMufrWbb+qfoNYLeuBHJFPhCkY5HVsctq5GL+5UUkBcIagqszVm-kTNJwa6EYPhRAqVuIAEWwHChFTRGApECAAsHKAAvwGAAL26AApcaAAQjaAAPArRAU0doCAAB2qAAXHKgAcPAziBogAJDmgALfugAPexRAYAASpoAA55oABADE2wCSCwdFGBSmmOQD+hjUulEx0oUXFAPUj1LVhQ8qnnyoD+MFBYAgWvUH6Qo+mws+KTRPltQKCRpXIDH5QhwHDyROiPODEx0A-uQBIAOfCDSyUcMRQCbCSMWICox1Rhcy9o9UaMKkxP0Zz44Rw5BTF9oJaFTHMk5AMuYrStUfoAExRMeMCyUqnF1GQ0UNK1Q4xqzJFE6+SvhNFTR5oW1E3hmYaVLoxukJjHw8TAg17fMcYUSTqeawbf6jCrMRzHOiAEtxSMxI-otAqxOSDjGrimsT9HmcAfvrFy+YZGbEVhktIjH7R5sZLSYh+UfjGEx1AMTHOQUZl6y9E+ACYC6wgoJVHQA1UYJYxx70JDHQU0MYkC9QwsbtQgxkPHtQCSUseO7OSriArGyht4a6KLRgAADpZwXQH0BR0YABhcoAAAcoAAvgdQGAAhTaAA3cqAAkcbgcUQB9EJRSwS5JxR9iJbGg80PL9LMxOZNcxmxLkm-RfMqkSjJKOzJH3GHAYMQ7HSgimiphJReXv0jQUWseZj0RRsRiGjhWehcxQxlOFAAwgyCsHGhx2wKDaQGZwFVErsfmu3GmRfaqIw50NpMSDKhwjrxDnEx8m-FWAGsi-Efxb7loL0AK9NaBmSr8XFAaKJIJ-FgJz8joqsYv8RAn-xc9jTEGYdMVZH3gfccsySxL0qWzwRucZBHXh+cYf6FxJcWXGVxtcQ3EtxbcR3FDxrZtEC-RnscFCzxD3B2T6Qo8YlCfItaIAnQJNpKFzyUoXFXIik90mn59IEPqDRwJxIFXLbxi0CwnkxbCYLj0AT8ZeRwJfCcKp9SA0kInjKryKRTiJRFK7EPC3sX1AIg34CmYeRoAFbB6A-QEyAyC3sJARdgpif6SKBlAJQzqIsMOHLohUiawnsJhApwmX03CSFK8JIUvwmyYA-ncomYpMWIksUuiTvG5R-OkgncQKCcfGNwKPmmziAsMKzESBTdOIB4M4cmkA3WKQAv7aQ7QJiDRUdsY6ioRC5Pkmgg82IGaBk7cbAg3xGIdzFZRfasEkdAJmCnHdR+IoBAvx9juMyNCkCflAaKecYPC3hIUSLE40T3A7SCJzUZAB9ISyAUAgJH8WlHP+FsWMlAxb3B2RTJO1jMn7ShAPsALJECUsm10s8S9yyYmyX+Z9IMPu4HhJhyVRSzxH3AZpnJyQH0jo+oiTpISJ9CXCqzxX3Jn6gAjydskeu55PsniJNyakazxk1MmG-JaidMl9Ix5ECnvJkSfgJPWa1DYADxCOqomcs6iQCkXk1yZIl+mSKfdRA8uMenTop0AJinGuiPnCkgpo-r-r6JBUdP7FRE1mVEeRkcdHF3SUKVskkRVvvZEaAv8lnGVufEdQkr8RkRQoFJVSdFQQikqnPaipRSVnQDIAJjUFPAe4mkDpod7jJ68Qoth2SEAPpBPHaAovLS7jMEvD4CTAMvH+6Bo-nrRy6KQbkzJFuRimbDHq6SuYpLYlinNCm8I3i5Aa+KiPryTe0mEbyquyJF6nJM16Fq50AvqQyge2cJk96agYxF1yC+3IIEoBp49pnzsyoaZ+ix8ovix4-eifKwgquBTJb45K0yXN6e4tkZgKbeP1o8TfYfvnmmCmWllX6LeMkVWnMo0EcjbvBOhJErbmx3iebcgSlm0oJUltk8rpp8WH0oT2hLsb76yFBvq5cu38Zm4up4yknrjpUyBa7AIVrjU5byx6jmTyacStJ5jqFGpsr2K2yl6Z7KvYAPpkAwEXfLd8BBmNr92hWrqCxWdZkb5DasALemXplZvtTXpFkPzHUAslKzC-yTZkvHNk30ckkdmP4szCxWcpGsxwaYpnFL3x4+jenWWYGcknmhhKryEEKbIAcZ6m12nKZAZD2rekqmZaGuk0JhsbQY204GdNFF+9XKX4dQSpnf5hGTcOBHfMySewhTS5mFNHjmcKsepDsSUZTg9ATlrxwBsinqeCXxJGV5HTiEIIyESm7GZRzBmZSaYnuMPGSYByWBwEHHT8vaCXo0RImfUmLQ+GUZKAZ8Knwolm76X7EoAX6eWaoGL6ZwxvpjAB+koAINHWY-pJdgkrUZ-6QlAkZQGbpi6gVmaeTwZEGWaq0yqugZk58nmeqQkZiGc+k7pAJmhlb6CUOgmx2uNHjTymEJu5mGZNmbhlxQWmV3Eex-Zo2qJZAWQIByk+aVsl7WOmaTGsxrGV2Hzp9dLuDBmIPhOCcguYPB7SZSmYXoqZw+twizSK-hpkiqapqbE6ZEqqSbZZ-sfRShZOuuZkKaCcYfG9Q36QCa-pjmb4nOZOmZlnAZ-WdZnjAXmb8BcaEpkiZ+ZlmUlkrZQWQhkHWSGc5FSykxvrr3K6aNFnN2asQabcqRppfqMAB8TDGEGeGV1l4RhGQtlmG-mQNle46pPlms2w5C5lPWzGT5alZxOuVmk6VWYZkTg1YHVnuMDWSfHKZxei1maRyuncYvZjaADm9ZIEaNmJxUABSZTGr6RaoxAGwEUKTZtvtcDTZuEUsEA572UDpRqY2TDGrZkGb5kwZCSvTlJxq2SFkmZVJuFlc5AelFmrJ26aqHAxkTmDHxZzpMzBE5f-k9mpZaOV9GOkGWbyayYsSmzlQAeWVtYFptZgDnFZLGUzkTmYOflHBmsACrllRsOXLGNZf1IjkaRbWSjlCYaWSpgY5LxpKmjGuoJLkk5XOWgYjZIGZD7k49YLZlTZ9mfdkzZl5NTmK5A5i7kYYf-ozk+ZeicQwS5Eeb3gc5B2UNkKq1Jhgab6JmOdkC5FZpdmTUrVH1CtUhKXnmYZRGVlkWQIiT7neIKhmVqB5lOXLkVoCuYaYKmH2YwCu5n8GrnMoKCfRneZ2ucDm65bGfrl7gUmfHkBE9WWbnw5TWZblqZ7WajkOZtec7E9ZjuX1ll53uR-C+5yeWrLVmdKlUmBkpOc5IB5Rlk0Eh5jeQlnL5-hPWBR562V7Gx5N6SvnSBieVJaW2lJleknZDBpeQXZQuV1StUvVGLmfKgWtvksxVeaqaz5TsbNn15yMSXmKmFquXmr5j2j9nq5BWZrlFZXLHtG950ef3nAFQ7MGZzsZ+QQCj5Plgkl6ACOdxCqZrWVdLT5tubLnz53mZjmiR-av-l45yGQTnMwytn7lk5VwBTkgFwefNmh5peQKr-5F+RfqLQm2Szl8FmIJyD35WNo-lTGqeXFqnZkWQ2Dv5XJs8pDUrVANStUo1D-lh5FkCwUpZ+UHblOZYBZTEQFv+dKr8FcBR3ka5owlrnIFJWX3llZGBZJm6gx8WIXOQeBWIAEFRBeAAkFyOWJmdZwBTmQO54mBvJbZsACwXr5KGR+ARZGeZpiKFqKpuGuZtOdoVbJ0uXoWUFoBW2YsmPBZAX6FQ5l0CWRNgKTGA4dhaDkOFFWcwVbJhOjOYNgwCH6T6QCIFOIIgNuXGa6g6NnekRYIRa0XhFbiJvm6gSoCS5-mrBV3gcFTQRSHGF9iDqYcmWBjFm4GNOZ2b0G6eWyrMG12Tqq3ZvUhaqtFtqjkU8UnuJv4BBIQahxsYkGXkY3piQSkW6Q6aHTA8G36gqRNmpgU0HFhYxSQISG8xUfpTFl2SwZZFcwczAbF-GjWZz5uRbsWjFpgbcY-BuZgPkJmTmi5pVFzkIDZuJeKZcUiR9Yd4YWQ6Ni0amBnYcyQ0SYAIiE4Mv6DsBbA3euJ574jSU8FY5IGYkHrpgoVMJbp2eRsrq+e6W+GLheNoelEOJ6WZ7kleNgwVHZUwlaFSWepAsa-yF6S8ZnqdMFUE20opfvl-p6RQqS42CRXMWkZCxdgZaIyxWgW8GHJTaSbFHpIkEEkuNtPHNFZeRSXcUSsg8UM2IOQ8ISldYcyTIljAKYEtGO5sEUiFsAH0W3AAxeEUyFWuq-ltox1kpT4cF8EMgW44chMh8WyqZ1I9J2WHyb+Fmxl0ClpiohCKGU4fn6Wt2SnP-baAU4iGUJQUsaLwkOSuWkXbFzKDGW1mcZeJQaemCmWj+lDlkxQb2RJC4zwe4aRqk-JWxQxYO+XFsxZIAxwovYe0aeqWVEER2hCmNl1acX77eCfp2WKGXfvqGXZWqlmGJFNeSzEWkWxemhNAqFE0CglgdE0BSmixX1AfFx+VOW8FB+VGWVpowsuXFF1KfaYD5u4Gt4ZJq4b+g56TOieVe0EmWUVOFF5YFGRmJ8beWeG-pkZaSC9KTOTIkK2Av7CZK-qmWzS0-Iv4+FHWWCWlF4Ob0X9FyQAQVwGtBYCDHCMHtWVwe7jOGn78XzB7ZtQPLNAC8QprlhXaANZehU52AxDhWcseFd-F0Rlbnpkrg2FSMy4V6qRPBjWZPHV5c8XHpp4KWtPN4SbYbXtakde-6L-Z4+BPl6jgAxPqsAHOgbNNgHEkPgOlUeTTMJWE+YldgU5O7OMaBmAOPgmnyVQGIpWiVvoBpWqVDKLslesWlZsS6VRPsuFA2esk8CXJclWZWtJIlUT7b4OziulEgLyXZVCVDlUpXAAUsIZWfoyPhQCdACPr8CI+HlZnzmVYldsRWgQSHxWG2m5vZVdgjlcpWQ+6TLdBZg94LmCAAd26AAskqAAV8q4BgAMbWgAC6mBAYAAL8YADp3q9EZVr0Pd5pp33pny-esaXuiXE1LvVVNMn1GT6neQTkiRAJQxCS7YubQOIil2uPl5V6V95sY4cwIiZeLdJRqIMldJ-SbpBzVSqubKQ+d+oCBBOICbsZIAG1cCkVBFaPYLyaQTgFAdk61dAlWQ-VYNWMeQrnFKrstdoiUxxGYOlV3guYMFnwA-ELhAAAfqACZO90GklvVSXqABfVP1RlX3QIifJyEWuYH-KzW58qmhtQ9AM7q5gfPM9X3QwWb+BpJW4EWwrVXQDywsJySdNKsxCNTVV7MCpJD7g1yrCE6HAaQPpB0wyAMEDEgfUKE5iUNNSED01hwBE5M1tNazXROHNSzV9QhjjzV01fUPE4C1rNYk4i1fUMk7i1hwKk5S1GTlLXZOmchnhs1lNefLM1gtcrVS13NQSSc1fNdbpq1rNcLXa1vNYcBi1RterWS1ZtazUy1ltX1By1NtYcAK1ZtdwAM1Y0G+5sgUTirXU1OtR7VS1-NfbWG1CpN7Wm1gdcbUW1IderXW14dazV21UdX1CO14dc7UU1AtYnXs1btdcCHAhjlTX61utVLUB12dSbV613tWHX51kdfnUx1+dfHVq1idYzVO1ejoXUFCfUNzVp1VwIcDxOWdd7V51QdfXXm13dVbW91ttf3UO13ddXXD1ddcnWN1o9RnWu1StYk7t1xtcHX51xdd7Wl13teXXe1ldbTUj149RrW11PtbvV+1CdULXT174IcDJOc9T3VS1K9cbVr1xtRvUN1SdbvXs1u9VrWH1U9dvWd199WLXN1RwKk7n1fdbLWD1d9VcQu129U-Wv1L9VXU51u9R-XANBddvWS139YcAZOf9QPXy1k9TXWv1YDZA171r9QfXYNMDYnUL1m9RLWT1MtYg3ZOKDUPXb1GDdg1YNxDTg3YNeDfQ0ENfUEQ331S9ffVX1sDXLVvuSNWyErgIiWrXTVlxBfDdVl4QdCxEVJKE6tUEThoihOZIk8BP0XUJcQEeIGNARfWEjWu60F2dfUxT0LVTAz0IgjbTVmSKjUcCM1QTMQ26NRJEE6GNkPkI0mkdzOzVO59MJD4RM01aAn5QYjfNWiN+jTcTiNcFXo1XE9TmY1aI4HGDWcs+kC-HTS4iZ4lloRjSECKJoQl+TLa4TdAD6QGjckDRNsTXFDxNwQIk1bCd5Oaq5NZkp96WQqTZE1fk0TXeQK6T9BgIU1MjWNC102iquy7gIiREzD8c0CGUXMxjCSD4Q8CGcAvxEINICww4if03aJbAMuzONJNV0B3674DNXWNvjdaBChECT41BNqoMs3CSCzWs1LN8xss0ZNkjZY6LNwTvI3gckTW8nZNsaGrI2h9guk1qNKetJhrGXUB426Qx1eKWrVqrPs1mSLFKbz7NtdOIl6ItoTHQiJzep81wJPzWo1JCZzX-F6Iccu8rPNpYEdVTCoXNjRxQQTlMKwtYegtUItRzaHoJQxIDDSBNrxCpJYSbTYs1mSjFPi0sUvzWepXFGmswx2NxjaFzIUK5aQLAtU+r2jyUvaCxSRN9zXK5TCqdM8GcMlpSmTNNFemQ6f0bLaoCfNczas2vEGzYq6EtMDPyV7NajbK3BNFNWSL7Na1KE43NqaMSC8tzII80kgeiKmjvKares1ItIUtw6otRzYC2vMpLds3ktjoRI17VFiI+r0tXQEI1MtClConTNILWo27qPLX3L+APiPy22ayRtXpWYoraVwvwETga39gw9mub8VLMoJXhVo1UT5MgrTjPZsgj1fdA5V+VTgHFVZVZVUvQb3mGBBOYDh1U5p-lZ0AjViVd5VRVYKPba9V24N1X0etwANVwgjHnW34+3leNXMOW8nMnuNYZa1HeNs1dAlkiqPpSlVeWnj+KkKfmnMlrV21Uc2bVPVSu27VNLc6SHVOLXa3BQp1ZfTnVHbZdWKeEUBZhUUEbXUZ+a4rWuS5tGVVDXiA-1Z9XfVv1XLGPtgNc+0g1d7XMlk190Pe1U1sNSMzw190Hw3XAT1WyAvVCGSRDo10sblBuuBQDjUkZ+NVNGE1NNN+0NuBViE2UNNDbTW1wcdd3W4dSDfh19QXDQR0cNxmqw1EdrdZR1MNIQAR0QNOHWPWINETpQ10Nxtdh20deHQLUEdN9eR3S1lHWR0EdbDbx0wNBHTR28dTdUrXROlDfR3G1rHerXsdvHUA3cdlHSR0kNXHRR3qdVHZp381iDZnWq13tWJ1c1g9XJ2s1CnQR1KdqDWbUEdqnafWUdQnQR3C1iDW3X6dxtTA2s1hnRPVS1JnSA1WdnHb52EdmnTZ0CdGnYg2z1LnerVCdBtYPUedDDd7XedD9eHXmdlHTx3Wd-HcfWAQtnZQ1kdotYPVudUDbHWxdsnYPVmdfnYl2WdZXXx2K1J9b-Xhd-9fbXZdGnf7XRdg9TJ3q18XSV1UN-nTw1K1yDbV3ldJdYPUNdcDU12+1LXcZ3FdlHQrXkNntRXWD1PHXV0FdQ3ZF1H1o3ZrXjdUtYzW8NUzXMlCNczSI2KtfjeQScgcIL0TatkTrI1D0JzaVKKNlxMo3BA4usd1Tk-BI92ndIHTTQ6N+3Vs2vEmygUD2NpjUnUWNHHVY2HN2zTFBwdf3fd3hORjp-RzJbjXM3wtlTKD19J5rWcStCL3Sj3HNoTaVJodaTVE2RNN8kmgaVXrSFKhCtcPhDLaOPZE3TSFBD0i9EFzcxhE9jLST1bCtcIEk20kTWT3nErPfT2lgL8PI0hNu7Xyo6NSQmrW4dr9K6LEgnPSSCs9oAItGAA98rLRgADAqgAG+mJ0crVCY0bYtC7gsPYs0dNj1sYDdNPQC-FjN35MM3OQoza8iEUEzQDS0Fi7VPrw9GPcs3-NB3Ts0TRCrV91KtuzT5FXANPSd0Y9cjVj3LV58uEk899uui3EtcxcyCrs8zZbJ2takJr2rSWLQsbyMGlc3q+9U5Psmm86fb0SQtIfTC2mtYegj2ItSTUX22t2gBi2N5SfcX0FNVfba2C9+9BpVuN+LTpKKU2fa63RAb2pwxZojPQk3etgoiy2vMdvZ7octYpty36twbaG3ZKA-SOhNJqRgn0itrjnGww9qfaqzZ901Y73e91mBv2kk0ROj0u9mPSVp79UjS1RqQccuP1f6fLdH0mt1sjdkKlNraD24t84ta2eNtrc6Q69jrfi0w6tPe320t4xYT2-dTPXi3Mt2Ku6kFAafS92Bt5-aYiT9aDASoXtrIXjrz9xlGQ7keKbRmlpt9bXpWWVqVTm13Qd7fm2FVJVRVVVVz1UTUZMBYl951KCfDsT8y1beD6yVbVTpXptyVV0AVMx5D21JVWxCEDRVMfBpUcD3lZm1JuW8sZXDt47ZfTI9Yg70ngcsKdckzt9gsZVyk1yauwKD6pOInnE5PcQwqDghJeJrlkg6LgCSI7RNEjtcEIvLgc+1kSTzt4xcoP7AcpIuUUDlkEO3kAS8mJRtypTYLCQ+pZEeUX04zLdKoDRtomkKVzA8ADOVOA9cC3tz1aAAEDhbUQMlt1VWW3YoxTIwNcDNA3sR0DRICIn8DeldgVsDtbUkMRVyQzwNNVoA5kMZtGlUIMm+88LD6iDYchO1zNSfUtVeS4TEn2WDMdEgO-6lyYoNvJZnh0NOSgEJcmh2PQHoOjtH4P0P0AsMEMNGDQwyYNkiFKf0NpYUPpUNGAYwzAlMKCHDHQ9D2g6ZJDtcw9JDQ+sPo4mcgLg9AliUow4CT2D7g6DRxk5PaJrHDDEbFWj2lHglW9tWA7sChDVwOEPgdkQ3lWEDxbSQPgdZA7ix1VVA5mkpDnVZ+ihVeQ0EONtqgLwOaVwIxgPPDpQwUDlD3drsDVDZaA0PoE9Q7UOlSzvRYP2CbQ17QvJnQ4smaDuwDFp9D+w-MOGD7cPsPLDNI6VKzDVI7sOLDBwysM6xknjHTEj5DF8zbDzI+MB7DSw4cM3Dl9CcN0jhw6uw7D4wPcNf2jw55WYDRPtCPdOS2GlV5t3w9EO-DpbZ2nGg3lGyjQUYDo1XxDXaf95qgSQyD7DeRzX8wKejxECAwOcGg8Q1MKjpW1se7RZjwcwgKQ70TDdQwyMfg5AAj3hy2jpo6yyuFIM2gUAktiN0ubzLo7r0olOBwx9qLTID2C5Cn5p+jwComOIMoICaTkA2ACGPfku4LpQDNolK6KAAsvIEBgAB9ugAJLegACvWgAMHxgAPnKBAYADq2j6SZjlxNmO4Ufo0JTAI5AKJR0ypY4tGAAzwbVjNY6WNNjrowE7kIEUPGMDJE7Ss1DDv8tcyyDqw7O0O0yY6VwrxFkN8xTjXQw6UTjK4FO3Tji1bON4jGI8cPyp68UuMcjaw3bq6xktICnXJRvpe4+B2Kf6PHjEYz4Pnj07cuPOkt435objvnveM7jRvjTRrMayHgCWAjFeCDMVGXaE4jIsjbVjROrVLE61Y8Tq1SJOrVMk6tUqTq1QZOrVNk6D4ytSMiITtWMhNHAqE7VjoTtWJhO1Y2E7Vi4TtWPhMn1UnUcCkTVHWhNJOKTuk5ZOgffeBT1IyORNHAlE0cDUTP9VxN4TPE3eBUdIyEJO2dWE2JMMTEk+7VhdskzRPyTRwIxMZdZ9aJM4T3EwRM1dhHeJMETvXUPUETFDU6iL9ww1vCaoHw6B2gAgAILKxY4ACncoAChioADwOoABxcn8OgdZA4E6LN7Y+3Cl9SPe3C19QU6VJtwSfaBPII+YLQCQTwgPpBtw+EHbIQAO9sfEoeGVDTTPAucNxBJ09DF44wJZMLyN2jcDpsDmkfQqcRuCRzWZ69o1UBS4v91o5hWqMto7A45TJ7ocBHpFU-VPWTeAxEOljlY8r1EBHk15M5gPk4sitjwQP5MUkgU9UyCQIU9NOAQqY5GhBjwDiJDXD4Y4GO6OQIGz2NDW4KmNGoPY-YK7TRJLJKRAuVRdFVxxY9QGAAzspy9aAQ5MuTHk7WNMASAVXGAAptb0BgABjygAGjKgAOQGy0ShCgAgAGQqgAJhKgAHNygABtZxY4AAICcWO1jQ0-YgRM7Y1sM6SlU24ObTVo992101zJlPWgxU7-TXDLwFlO4zIkFXL2x6FGNPtj1U6CArTThjVObTepXRJ+TOY9jPZT8DvjPMzRM3TMuc2veTNkAQ5ITz9E3gw2Ci8kwLLKXluJZM2BubXAJXoDgQwqNiVptn164YiQ-CO8yWaakNGjzVaD3OjNUCiMx2G1TK1ej2PafbLtoPXKTr0RFIcWI9crRew00+7a8QUjLNFB575onMq2LGZMLY5WtojgZgSOfKnbMwMJmr8BxycZPi0kmt8R277t4zOv379GzYPRHAEk-QjhWscsi0Y9FoY3kb9axs-Ymzkc7apskp1K8jcAvhc6LyagjsSDyafjjy526pc0Ji7gEcwYZTIaQP6CXlWeF7IU6qNKcDIAgs1fQ29F7r7LyenbUNWCuic3VPWzCc3ogatwbYnIe9FrRnPttwQP3NXVEtM6JDzLzXH3nyFNZ8iRA3RPIFWwBAB0Dwholf4Db0iLEAA) to go to ts-playground and try it out!

![type-toc-example](./docs/imgs/type-toc-example.png)

# Language Grammar of Toc
> see [Toc Grammar](./docs/grammar.md)

# Implement Detail
> see [类型体操之实现一个类C风格语言的解释器](./docs/implement-detail.md)

# License
MIT