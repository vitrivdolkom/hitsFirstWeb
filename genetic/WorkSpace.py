from itertools import permutations
from random import *


def generaterasst(dot): # функция для подсчета расстояний новой точки относительно всех остальных
    rasst[tuple(dot)] = {}
    for x, y in dots:
        rasst[tuple(dot)][(x,y)] = ((x-dot[0]) ** 2 + (y-dot[1]) ** 2) ** .5
        rasst[(x,y)][tuple(dot)] = rasst[tuple(dot)][(x,y)]
    rasst[tuple(dot)][tuple(dot)] = 0
    dots.append(dot)

def rootcounter(root): # функция для подсчета пути коммивояжёра по входному массиву точек маршрута root (селекционная fitness-функция)
    result = 0
    for i in range(len(root)-1):
        result += rasst[tuple(root[i])][tuple(root[i+1])]

    result += rasst[tuple(root[-1])][tuple(root[0])]
    return result

def crossing(par1, par2, point): # скрещивание родительских хромосом
    flags1 = [0] * n
    flags2 = [0] * n
    #print(par1, par2)
    result = par1.copy()
    result = result[:point+1]

    for el in result:
        #print(par1.index(el), par2.index(el), n, par1, par2, el)
        flags1[par1.index(el)] = 1
        flags2[par2.index(el)] = 1

    for i in range(point+1, n):
        if flags2[i] == 0:
            result.append(par2[i])
            flags2[i] = 1
            #print(par1.index(par2[i]), n)
            flags1[par1.index(par2[i])] = 1

    for i in range(point+1, n):
        if flags1[i] == 0:
            result.append(par1[i])



    return result

def mutation(root):
    '''indexes = list(range(n))
    ind1 = choice(indexes)
    indexes.pop(ind1)
    ind2 = choice(indexes)
    root[ind1], root[ind2] = root[ind2], root[ind1]'''
    method = randint(0,2)
    if method == 0:
        indexes = list(range(n))
        ind1 = choice(indexes)
        indexes.pop(ind1)
        ind2 = choice(indexes)
        root[ind1], root[ind2] = root[ind2], root[ind1]
    elif method == 1:
        indexes = list(range(n))
        ind1 = choice(indexes)
        indexes.pop(ind1)
        ind2 = choice(indexes)
        f, s = min(ind1, ind2), max(ind1, ind2)
        root = root[:f] + list(reversed(root[f:s])) + root[s:]
    else:
        for i in range(n):
            if uniform(0,1) < 0.1:
                ind1 = ind2 = 0
                while ind1 == ind2:
                    ind1 = randint(0, n-1)
                    ind2 = randint(0, n-1)
                root[ind1], root[ind2] = root[ind2], root[ind1]
    return root

dots = []
rasst = {}

def solver(coords):
    global dots
    global rasst

    if len(dots) > 0:
        dots = []
    if len(rasst) > 0:
        rasst = {}
    if len(coords) == 0:
        return [[0, 0]]


    #n = int(input())
    global n
    n = len(coords)

    for i in range(n):
        x, y = coords[i][0], coords[i][1]
        generaterasst([x, y])
    if any(coords.count(el) > 1 for el in coords) or any(((coords[i][0]-coords[j][0])**2 + (coords[i][1]-coords[j][1])**2)**.5 <= 15 for i in range(len(coords)-1) for j in range(i+1, len(coords))):
        return [['Ловко ты это придумал', [0]]]
    if len(coords) == 2:
        return [[rootcounter(coords), [1, 2]]]

    if len(coords) == 3:
        return [[rootcounter(coords), [1, 2, 3]]]


    Generation = []

    count = 0


    for p in permutations(dots):
        Generation.append(list(p))
        count += 1
        if count == int(n*1.3):
            break


    GlobalBestSolution = rootcounter(Generation[0])

    num_of_generatios = 1_000
    crossing_probability = 0.9
    mutating_probability = 10

    iterations = 0

    if len(dots) == 1:
        return [[0,[1]]]
    minlength = 100000
    minmas = []
    checker = 0
    ans = []
    while iterations < num_of_generatios:

        iterations += 1
        #print(Generation)
        '''indxs = list(range(len(Generation)))
        # формирование родительских пар
        in1 = choice(indxs)
        parent1 = Generation[in1] # первый родитель
        indxs.pop(in1)
        parent2 = Generation[choice(indxs)] # второй родитель'''
        #Generation = sorted(Generation, key=rootcounter)
        bests = []

        for i in range(len(Generation)):
            f = s = t = 0

            while f == s or f == t or s == t:
                f = randint(0, len(Generation)-1)
                s = randint(0, len(Generation)-1)
                t = randint(0, len(Generation)-1)
            bst = min([Generation[f], Generation[s], Generation[t]], key=rootcounter)
            bests.append(bst)



        nxt = []

        for i in range(0,len(bests)-1, 2):
            first, second = bests[i], bests[i+1]
            point = randint(1, n - 1)
            potomok1 = crossing(first, second, point)
            potomok2 = crossing(second, first, point)

            '''if random() < 0.9:
                nxt.append(potomok1)
                nxt.append(potomok2)

            else:
                nxt.append(first)
                nxt.append(second)'''
            nxt.append(potomok1)
            nxt.append(potomok2)

        for i in range(len(nxt)):
            if random() < 0.3:
                nxt[i] = mutation(nxt[i])

        Generation = nxt[:]


        curmin = min(Generation, key=rootcounter)
        curval = rootcounter(curmin)
        if curval < minlength:
            minlength = curval
            minmas = curmin[:]
            checker += 1
        else:
            checker -= 1

        if checker < -n**4:
            break
        #print(len(Generation))
        #yield [minlength, [dots.index(element)+1 for element in minmas]]
        troot = [dots.index(element)+1 for element in curmin]
        if not(ans) or troot != ans[-1][1]:
            ans.append([curval, troot])

        '''# Этап кроссинговера - формирование хромосом особей-потомков путём одноточечного порядкового скрещивания
        # через точку разрезра перекрещиваем хромосомы родителей
        point = randint(0, n - 1)
        potomok1 = crossing(parent1, parent2, point)
        potomok2 = crossing(parent2, parent1, point)

        # начало этапов мутации и селекции особей
        rnd = 0
        if rnd < mutating_probability:
            mutated1 = mutation(potomok1) # первый мутировавший потомок
            mutated2 = mutation(potomok2) # второй мутировавший потомок

            Generation.append(mutated1)
            Generation.append(mutated2)
            Generation = sorted(Generation, key = rootcounter)

            for i in range(2):
                Generation.pop()'''
    #Generation = sorted(Generation, key=rootcounter)
    #return [rootcounter(Generation[0]), [dots.index(element)+1 for element in Generation[0]]]

    #return [minlength, [dots.index(element)+1 for element in minmas]]
    ans.append([minlength, [dots.index(element)+1 for element in minmas]])
    return ans

    # print(rootcounter(Generation[0]))
    #
    # for element in Generation[0]:
    #     print(dots.index(element)+1, end = ' ')

