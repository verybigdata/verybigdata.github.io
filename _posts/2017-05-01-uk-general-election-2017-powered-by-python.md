---
header-img: "img/parliment.jpeg"
---
For anyone like me who wants to do DIY election analysis, first step is to get the data and make it ready for analysis. This is a time consuming part of the process and sadly it's also must do part. According to oppinion polls most important subject in this election is brexit, given that referandum result and 2015 general election results are vital for any analysis. In this post I will demonstrade how did I get the data and what did I do to clean it. It's important partially because I made this datasets public so anyone whom whishes to do their own anlysis can use clean and reliable data.

Data souce for general election is from electoral commisions [website](http://www.electoralcommission.org.uk/our-work/our-research/electoral-data) and for referandum result its from [wikipedia](https://en.wikipedia.org/wiki/Results_of_the_United_Kingdom_European_Union_membership_referendum,_2016) and the reason why I choose wikipedia is that electoral commition doesn't have a result by constituency. If you dont want to be involve with data wrangling then you can get the end product of this process from my Github repo [here.](https://github.com/bbuluttekin/election_data_2017)

Let's get the open source librarys I used and take a peak at the data.


```python
import requests
import bs4 as bs
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('hocl-ge2015-results-summary.csv')

df.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ons_id</th>
      <th>ons_region_id</th>
      <th>constituency_name</th>
      <th>county_name</th>
      <th>region_name</th>
      <th>country_name</th>
      <th>constituency_type</th>
      <th>declaration_time</th>
      <th>result</th>
      <th>first_party</th>
      <th>...</th>
      <th>ukip</th>
      <th>green</th>
      <th>snp</th>
      <th>pc</th>
      <th>dup</th>
      <th>sf</th>
      <th>sdlp</th>
      <th>uup</th>
      <th>alliance</th>
      <th>other</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>W07000049</td>
      <td>W92000004</td>
      <td>Aberavon</td>
      <td>West Glamorgan</td>
      <td>Wales</td>
      <td>Wales</td>
      <td>County</td>
      <td>08/05/2015 03:19</td>
      <td>Lab hold</td>
      <td>Lab</td>
      <td>...</td>
      <td>4971</td>
      <td>711</td>
      <td>0</td>
      <td>3663</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1623</td>
    </tr>
    <tr>
      <th>1</th>
      <td>W07000058</td>
      <td>W92000004</td>
      <td>Aberconwy</td>
      <td>Clwyd</td>
      <td>Wales</td>
      <td>Wales</td>
      <td>County</td>
      <td>08/05/2015 02:48</td>
      <td>Con hold</td>
      <td>Con</td>
      <td>...</td>
      <td>3467</td>
      <td>727</td>
      <td>0</td>
      <td>3536</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>S14000001</td>
      <td>S92000003</td>
      <td>Aberdeen North</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>Borough</td>
      <td>08/05/2015 03:40</td>
      <td>SNP gain from Lab</td>
      <td>SNP</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>24793</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>392</td>
    </tr>
    <tr>
      <th>3</th>
      <td>S14000002</td>
      <td>S92000003</td>
      <td>Aberdeen South</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>Borough</td>
      <td>08/05/2015 09:39</td>
      <td>SNP gain from Lab</td>
      <td>SNP</td>
      <td>...</td>
      <td>897</td>
      <td>964</td>
      <td>20221</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>139</td>
    </tr>
    <tr>
      <th>4</th>
      <td>S14000003</td>
      <td>S92000003</td>
      <td>Airdrie and Shotts</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>Scotland</td>
      <td>County</td>
      <td>08/05/2015 03:07</td>
      <td>SNP gain from Lab</td>
      <td>SNP</td>
      <td>...</td>
      <td>1088</td>
      <td>0</td>
      <td>23887</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>136</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 28 columns</p>
</div>



Uk is divided to 650 constituency, we should check the sum before proceed to any other operation.


```python
len(df.constituency_name.unique())
```




    650



It appears number of entries check. Let's now examine the all the parties hold seats and check if there is any error.


```python
df.first_party.unique()
```




    array(['Lab', 'Con', 'SNP', 'PC', 'DUP', 'SDLP', 'SF', 'Green', 'Spk',
           'LD', 'UKIP', 'UUP', 'Ind'], dtype=object)



As we can see there is two non-party entry in the data. One of it is 'Ind' for Indipendent candidate and other one is 'Spk' which is short hand for House Speaker. Vote count for both of these instences are recorded in column 'other', given that condition it's a good practice to store these instences as other so we can make cross calculation between records to corresponding column data. One way this could be helpful for us is to calculate how many votes first party received in all constituencies.


```python
df.loc[df.first_party == 'Ind', ['first_party']] = 'other'
df.loc[df.first_party == 'Spk', ['first_party']] = 'other'
```

We should check the 'second_party' column too.


```python
df.second_party.unique()
```




    array(['UKIP', 'Lab', 'Con', 'LD', 'Alliance', 'SF', 'DUP', 'PBPA',
           'Respect', 'Green', 'PC', 'SNP', 'UUP', 'Ind', 'TUV'], dtype=object)



We should apply same change to 'pbpa' and 'respect' too.


```python
df.loc[df.second_party == 'pbpa', ['second_party']] = 'other'
df.loc[df.second_party == 'respect', ['second_party']] = 'other'
```

Now we can change to lower case for all the string entries so when we merge with referandum result, we don't get any conflicted constituency names.


```python
col_to_lower = ['constituency_name', 'county_name', 'region_name', 'country_name', 'constituency_type',
               'result', 'first_party', 'second_party']

for col in col_to_lower:
    df[col] = [_.lower() for _ in df[col]]
```

Also constituencies that have a special chracter in their name will also create conflic when merged. Here I will remove all characters from constituency names.


```python
const_name = []
for i in df.constituency_name:
    if ',' in i:
        j = "".join(i.split(','))
        if ' &' in j:
            const_name.append(j)
        else:
            const_name.append(j)
    elif '-' in i:
        j = " ".join(i.split('-'))
        const_name.append(j)
    else:
        const_name.append(i)

df.constituency_name = const_name
```

We now can fetch the referandum results. Data we are looking for stored in the 36th (Python use 0 based index.) table in that page. I will print the table head variables to see if thats the correct table.


```python
url = 'https://en.wikipedia.org/wiki/Results_of_the_United_Kingdom_European_Union_membership_referendum,_2016'
respond = requests.get(url)

soup = bs.BeautifulSoup(respond.text, 'lxml')
div = soup.find_all('div', class_='mw-content-ltr')[0]
tables = div.find_all('table')
tb = tables[36]
tb.find_all('th')
```




    [<th colspan="2" rowspan="2">Constituency</th>,
     <th rowspan="2">Member of Parliament</th>,
     <th rowspan="2">MP position</th>,
     <th colspan="2" rowspan="2"></th>,
     <th rowspan="2">Region</th>,
     <th colspan="2">Proportion of votes</th>,
     <th rowspan="2">Notes</th>,
     <th>Remain %</th>,
     <th>Leave %</th>]



That's looks correct, but changing the column names will help us during the validation process and prevent confusion. New column names can be set as below.


```python
colums = ['constituency_name_eu', 'parliament_member', 'mp_position', 'region_name_eu', 'remain', 'leave']
```

Now we can parse all input to data frame and take a peak at the data set.


```python
df_cons = pd.DataFrame(columns=colums)

for i, row in enumerate(tb.find_all('tr')[2:]):
    rows = []
    rows.append(row.find_all('td')[1].text)
    rows.append(row.find_all('td')[2].text)
    rows.append(row.find_all('td')[3].text)
    rows.append(row.find_all('td')[6].text)
    rows.append(row.find_all('td')[7].text)
    rows.append(row.find_all('td')[8].text)
    df_cons.loc[i] = rows

df_cons.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>constituency_name_eu</th>
      <th>parliament_member</th>
      <th>mp_position</th>
      <th>region_name_eu</th>
      <th>remain</th>
      <th>leave</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Streatham</td>
      <td>Chuka Umunna</td>
      <td>Remain</td>
      <td>Greater London</td>
      <td>79.5%</td>
      <td>20.5%</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Bristol West</td>
      <td>Thangam Debbonaire</td>
      <td>Remain</td>
      <td>South West England</td>
      <td>79.3%</td>
      <td>20.7%</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Hackney North and Stoke Newington</td>
      <td>Diane Abbott</td>
      <td>Remain</td>
      <td>Greater London</td>
      <td>79.1%</td>
      <td>20.9%</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Glasgow North</td>
      <td>Patrick Grady</td>
      <td>Remain</td>
      <td>Scotland</td>
      <td>78.4%</td>
      <td>21.6%</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Islington North</td>
      <td>Jeremy Corbyn</td>
      <td>Remain</td>
      <td>Greater London</td>
      <td>78.4%</td>
      <td>21.6%</td>
    </tr>
  </tbody>
</table>
</div>



Again validating the number of constituencies.


```python
len(df.constituency_name)
```




    650



Percentage sign within the remain and leave columns should be removed so we can turn that columns into floting numbers and make it available to arithmetic operations.


```python
df_cons.remain = [float(_.split('%')[0]) for _ in df_cons.remain]
df_cons.leave = [float(_.split('%')[0]) for _ in df_cons.leave]
```

Finally, unifying constituency names by turning then to lower case and removing special characters. It's also important to notice that region names slightly diffrent from general election results. In the second data set region named as south west england instead of south west, we should also unify them too.


```python
df_cons.constituency_name_eu = [_.lower() for _ in df_cons.constituency_name_eu]
df_cons.region_name_eu = [_.lower() for _ in df_cons.region_name_eu]
df_cons.mp_position = [_.lower() for _ in df_cons.mp_position]
```


```python
region_n = []
for i in df_cons.region_name_eu:
    if 'of' in i.split(' '):
        region_n.append(i[:-11])
    elif 'england' in i.split(' '):
        region_n.append(i[:-8])
    elif 'greater' in i.split(' '):
        region_n.append(i[-6:])
    else:
        region_n.append(i)

df_cons.region_name_eu = region_n
```


```python
df_cons.loc[df_cons.constituency_name_eu == 'berwickshire, roxburgh selkirk',
            'constituency_name_eu'] = 'berwickshire roxburgh and selkirk'
df_cons.loc[df_cons.constituency_name_eu == 'ynys môn', 'constituency_name_eu'] = 'ynys mon'
```


```python
cons_name = []
for i in df_cons.constituency_name_eu:
    if ',' in i:
        j = "".join(i.split(','))
        if ' &' in j:
            j = "".join(i.split(' &'))
            cons_name.append(j)
        else:
            cons_name.append(j)
    elif ' &' in i:
        cons_name.append("".join(i.split(' &')))
    elif '-' in i:
        j = " ".join(i.split('-'))
        cons_name.append(j)
    else:
        cons_name.append(i)

df_cons.constituency_name_eu = cons_name
```

## Time for Testing

Now that our data entries are unified we can run some validation tests to see if everything is as expected.
First test is for referandum data integrity. I will check if the percentage sums of leave and remain add up to 100%.


```python
l_validate = df_cons.remain + df_cons.leave

df_cons.ix[l_validate[l_validate != 100].index]
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>constituency_name_eu</th>
      <th>parliament_member</th>
      <th>mp_position</th>
      <th>region_name_eu</th>
      <th>remain</th>
      <th>leave</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>24</th>
      <td>richmond park</td>
      <td>Sarah Olney</td>
      <td>remain</td>
      <td>london</td>
      <td>73.3</td>
      <td>27.7</td>
    </tr>
    <tr>
      <th>94</th>
      <td>cardiff north</td>
      <td>Craig Williams</td>
      <td>remain</td>
      <td>wales</td>
      <td>60.9</td>
      <td>39.0</td>
    </tr>
    <tr>
      <th>143</th>
      <td>brighton kemptown</td>
      <td>Simon Kirby</td>
      <td>remain</td>
      <td>south east</td>
      <td>57.6</td>
      <td>43.4</td>
    </tr>
    <tr>
      <th>197</th>
      <td>leeds central</td>
      <td>Hilary Benn</td>
      <td>remain</td>
      <td>yorkshire and the humber</td>
      <td>52.4</td>
      <td>47.4</td>
    </tr>
    <tr>
      <th>353</th>
      <td>wolverhampton south west</td>
      <td>Rob Marris</td>
      <td>remain</td>
      <td>west midlands</td>
      <td>45.6</td>
      <td>54.6</td>
    </tr>
    <tr>
      <th>459</th>
      <td>islwyn</td>
      <td>Chris Evans</td>
      <td>remain</td>
      <td>wales</td>
      <td>45.3</td>
      <td>58.8</td>
    </tr>
    <tr>
      <th>554</th>
      <td>dover</td>
      <td>Charlie Elphicke</td>
      <td>remain</td>
      <td>south east</td>
      <td>36.8</td>
      <td>63.1</td>
    </tr>
    <tr>
      <th>555</th>
      <td>old bexley and sidcup</td>
      <td>James Brokenshire</td>
      <td>remain</td>
      <td>london</td>
      <td>36.8</td>
      <td>63.1</td>
    </tr>
  </tbody>
</table>
</div>



It appears we have 8 instances of inaccuracies. This is paticularly hard to automate problem which I had to look up other reported results and manually change them.


```python
remain_man = [69.3, 60.9, 57.6, 52.5, 45.6, 45.3, 36.9, 36.9]
leave_man = [30.7, 39.1, 42.4, 47.5, 54.4, 54.7, 63.1, 63.1]

df_cons.ix[l_validate[l_validate != 100].index, 'remain'] = remain_man
df_cons.ix[l_validate[l_validate != 100].index, 'leave'] = leave_man
```

Final test is about consituency names, I will check if there is any constituency name not appears in other data set.


```python
for i in df.constituency_name.unique():
    if i not in df_cons.constituency_name_eu.unique():
        print('{} name is not available in the referandum data set'.format(i))
else:
    print('Constituency names are parsed correctly.')
```

    Constituency names are parsed correctly.
