# Steem proposal to reduce voting rings and self-voting

The ideal of Steem is to reach a system where people earn the currency by using their brain (also called proof-of-brain as states the [bluepaper](https://steem.io/steem-bluepaper.pdf)). The more brain, the more rewards. This is the power that makes STEEM valuable and appreciated, and we must preserve and keep this principle very high.

However, in recent days we see people **abusing self-voting**, and also small groups **voting in a circle way** to themselves without taking into account the content of the post. I'm not saying that self-voting or voting rings are bad at all (there are cases where this practice is fine). The problem comes when people get used to this (especially whales), then the competition to get a vote is lost, and that is why the creation of good content is discouraged. And as I said earlier, we must preserve the good content, the proof-of-brain.

## Proposal

**Let's reduce the value of the vote to those votes that represent a good percentage of the curation of a user.**

We can not impose that the vote to be distributed among 1000 different accounts, this would be very restrictive and unpopular. But I think that a fair number is distributing the vote among at least 20 people, meaning no more than the 5% of our voting power for each account. 

Each user will have 20 "resistances" that represents the amount of voting power spend in a particular user. For instance, Alice has a voting power at 100%. If she votes Bob the voting power is reduced 2%. This 2% is added to one resistance called "Bob". When this resistance is above 5% the worth of the vote is reduced proportionally to this percentage.

And how is the percentage of each resistance reduced? The same amount added to one resistance must be subtracted from the remaining 19 resistances. In other words, the 20 resistances represents the distribution of our votes.

I know it is difficult to visualize at first glance. For this reason, I have created this repository with a very intuitive simulator where you can understand it directly.

## Benefits

* Voting rings and self-voting is reduced.
* The computational cost is small since only 20 counters should be added for a user, no more.
* It is easy to implement on the blockchain, as you can see in the simulator.


